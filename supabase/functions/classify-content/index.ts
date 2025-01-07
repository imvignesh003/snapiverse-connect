import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content } = await req.json()

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Use GPT-3 to classify content
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Classify the following content as either "productivity" or "entertainment". Only respond with one of these two words.\n\nContent: ${content}\n\nClassification:`,
      max_tokens: 10,
      temperature: 0.3,
    })

    const classification = completion.data.choices[0].text.trim().toLowerCase()

    return new Response(
      JSON.stringify({ 
        classification: classification === 'productivity' ? 'productivity' : 'entertainment' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})