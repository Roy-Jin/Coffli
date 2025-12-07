const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders,
  });
}

export default handleOptions;