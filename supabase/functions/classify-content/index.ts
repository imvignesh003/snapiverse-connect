import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    console.log('Received content for classification:', content);

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    // Use GPT-4o-mini to classify content
    const completion = await openai.createCompletion({
      model: "gpt-4o-mini",
      prompt: `Classify the following content as either "productivity" or "entertainment". Only respond with one of these two words.\n\nContent: ${content}\n\nClassification:`,
      max_tokens: 10,
      temperature: 0.3,
    });

    const classification = completion.data.choices[0].text.trim().toLowerCase();
    console.log('Classification result:', classification);

    return new Response(
      JSON.stringify({ 
        classification: classification === 'productivity' ? 'productivity' : 'entertainment' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in classify-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});