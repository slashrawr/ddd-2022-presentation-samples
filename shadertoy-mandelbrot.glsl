int max_iterations = 300;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    vec3 col = vec3(.8);
    float zoom = iTime*10.;
    float a = (uv.x-(1.16*zoom))/zoom;
    float b = (uv.y+(.3*zoom))/zoom;
    float ca = a;
    float cb = b;
    
    float iteration = 0.;
    
    for (int i = 0; i < max_iterations; i++)
    {
        float next_a = (a*a)-(b*b);
        float next_b = 2.0*a*b;
        
        a = next_a+ca;
        b = next_b+cb;
        
        if (abs(a+b) > 32.0)
            break;
        
        iteration++;
    }
    
    col = vec3(sin(iteration), cos(iteration), cos(iteration));
    
    //debugging - centre of screen
    //col *= smoothstep(abs(uv.x),0.,.001);
    //col *= smoothstep(abs(uv.y),0.,.001);

    fragColor = vec4(col,1.0);
}