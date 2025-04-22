import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIMEOUT_MS = 30000; // 30 second timeout

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PALMETTO_API_KEY = Deno.env.get('PALMETTO_API_KEY');
    if (!PALMETTO_API_KEY) {
      console.error('PALMETTO_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Palmetto API key is missing. Please configure the secret.' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Initiating Palmetto API request to /systems endpoint...");
    
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const palmettoResponse = await fetch('https://api.palmetto.com/v1/systems', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PALMETTO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!palmettoResponse.ok) {
        const errorText = await palmettoResponse.text();
        console.error(`Palmetto API error (${palmettoResponse.status}):`, errorText);
        
        let errorMessage = 'Failed to fetch data from Palmetto API';
        if (palmettoResponse.status === 401) {
          errorMessage = 'Invalid Palmetto API key';
        } else if (palmettoResponse.status === 403) {
          errorMessage = 'Access denied to Palmetto API';
        } else if (palmettoResponse.status === 404) {
          errorMessage = 'Palmetto API endpoint not found. Please verify the API endpoint.';
        }
        
        return new Response(
          JSON.stringify({ 
            error: errorMessage,
            details: errorText,
            status: palmettoResponse.status 
          }),
          { 
            status: palmettoResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Parse the response
      const systems = await palmettoResponse.json();
      console.log(`Retrieved ${Array.isArray(systems) ? systems.length : 'unknown'} systems from Palmetto API`);

      // Validate response structure
      if (!Array.isArray(systems)) {
        console.error('Unexpected API response format:', systems);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid API response format',
            details: 'Expected an array of systems' 
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (systems.length === 0) {
        console.warn('No systems found in Palmetto API response');
        return new Response(
          JSON.stringify({ 
            message: 'No systems found in the Palmetto API',
            successCount: 0,
            errorCount: 0
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Update Supabase with system data
      let successCount = 0;
      let errorCount = 0;
      const validationErrors: string[] = [];

      for (const system of systems) {
        try {
          // Enhanced validation
          if (!system.id) {
            validationErrors.push(`System missing ID`);
            errorCount++;
            continue;
          }

          if (!system.location?.latitude || !system.location?.longitude ||
              isNaN(system.location.latitude) || isNaN(system.location.longitude)) {
            validationErrors.push(`Invalid coordinates for system ${system.id}`);
            errorCount++;
            continue;
          }

          const { error } = await supabase
            .from('grid_assets')
            .upsert({
              asset_type: 'house',
              latitude: system.location.latitude,
              longitude: system.location.longitude,
              palmetto_id: system.id,
              installation_date: system.installDate,
              system_size_kw: system.systemSize,
              annual_production_kwh: system.annualProduction,
              system_type: system.systemType,
              install_year: new Date(system.installDate).getFullYear(),
            }, {
              onConflict: 'palmetto_id'
            });

          if (error) {
            console.error(`Supabase upsert error for system ${system.id}:`, error);
            errorCount++;
            validationErrors.push(`Database error for system ${system.id}: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (insertError) {
          console.error(`Error processing system ${system?.id}:`, insertError);
          errorCount++;
          validationErrors.push(`Processing error for system ${system?.id}`);
        }
      }

      console.log(`Sync complete: ${successCount} systems synced, ${errorCount} errors`);
      if (validationErrors.length > 0) {
        console.log('Validation errors:', validationErrors);
      }

      return new Response(
        JSON.stringify({ 
          message: `Successfully synced ${successCount} systems${errorCount > 0 ? ` (${errorCount} errors)` : ''}`,
          successCount,
          errorCount,
          validationErrors: validationErrors.length > 0 ? validationErrors : undefined
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Palmetto API request timed out after', TIMEOUT_MS, 'ms');
        return new Response(
          JSON.stringify({ 
            error: 'Request timed out',
            details: `Palmetto API request timed out after ${TIMEOUT_MS/1000} seconds` 
          }),
          { 
            status: 504,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.error('Failed to connect to Palmetto API:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Network error when connecting to Palmetto API',
          details: fetchError.message 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error in palmetto-sync function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Unexpected server error', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
