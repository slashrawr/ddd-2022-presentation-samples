int max_iterations = 100;
float infinity_test = 16.;
bool zoom_in = true;
vec3 palette[5];

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    palette[0] = vec3(86, 44, 44)/255.;
    palette[1] = vec3(242, 84, 45)/255.;
    palette[2] = vec3(245, 223, 187)/255.;
    palette[3] = vec3(14, 149, 148)/255.;
    palette[4] = vec3(18, 116, 117)/255.;
    
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    vec3 col = vec3(.8);
    float zoom = iTime*float(iFrame/10);
    vec2 offset = vec2(.7115, .25);
    
    if (!zoom_in)
    {
        zoom = .45;
        offset = vec2(0);
        
    }
    float a = (uv.x-(offset.x*zoom))/zoom;
    float b = (uv.y+(offset.y*zoom))/zoom;
    float ca = a;
    float cb = b;
    float ab = 0.;
    
    float iteration = 0.;
    
    for (int i = 0; i < max_iterations; i++)
    {
        float next_a = pow(a,2.)-pow(b,2.);
        float next_b = 2.0*a*b;
        
        a = next_a+ca;
        b = next_b+cb;
        ab = abs(a+b);
       
        if (ab > infinity_test)
            break;
        
        iteration++;
    }
    
    int palette_no = int(mod(iteration, 5.));
    col = palette[palette_no] * ab/infinity_test*.2;
    
    //debugging - centre of screen
    //col *= smoothstep(abs(uv.x),0.,.001);
    //col *= smoothstep(abs(uv.y),0.,.001);

    fragColor = vec4(col,1.);
}