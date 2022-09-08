#define MAX_STEPS 500
#define MIN_DIST 0.00001
#define MAX_DIST 500.
#define TOGGLE_DIST_FIELD 0
#define TOGGLE_NORMALS 0

struct sphere
{
    vec3 location;
    float radius;
};


float sdSphere(vec3 point, sphere s)
{
    return distance(point, s.location)-s.radius;
}

float smoothMax(float dist1, float dist2, float factor)
{
    return log(exp(factor*dist1)+exp(factor*dist2))/factor;
}

float smoothMin(float dist1, float dist2, float factor)
{
    return -smoothMax(-dist1,-dist2,factor);
}

float calcScene(vec3 point)
{
    sphere sphere1;
    sphere1.location = vec3(cos(iTime*1.5)*3., 3., sin(iTime*1.5)*3.+10.);
    sphere1.radius = .5;
    
    sphere sphereField;
    sphereField.location = vec3(1., 1., 1.);
    sphereField.radius = .25;
    
    float sphereDist = sdSphere(point, sphere1);
    float sphereFieldDist = sdSphere(mod(point,2.), sphereField);
    float groundDist = point.y;
    
    float spheres = smoothMin(sphereDist, sphereFieldDist, .9);

    return min(spheres, min(sphereFieldDist, groundDist));
}

float rayMarch(vec3 rayOrigin, vec3 rayDirection)
{
    float originDist = 0.;
    
    for (int i = 0; i < MAX_STEPS; i++)
    {
        vec3 currentPoint = rayOrigin + rayDirection * originDist;
        float marchDist = calcScene(currentPoint);
        originDist += marchDist;
        
        if (originDist > MAX_DIST || marchDist < MIN_DIST)
            break;
    }
    
    return originDist;
}

vec3 calcNormal(vec3 point)
{
    //Estimate the normal by inspecting neighbouring pixels
    vec2 shift = vec2(.01,0.);
    float dist = calcScene(point);
    vec3 normal = dist - vec3(calcScene(point-shift.xyy), calcScene(point-shift.yxy), calcScene(point-shift.yyx));
    return normalize(normal);
    
}

float calcLighting(vec3 point)
{
    //Light origin
    vec3 lightPos = vec3(-2., 10., 3.);
    
    vec3 lightVector = normalize(lightPos-point);
    vec3 normal = calcNormal(point);
    
    //Diffuse lighting
    float diffuse = clamp(dot(lightVector, normal), 0., 1.);
    
    //Shadows
    float lightDistance = rayMarch(point+normal*MIN_DIST*1.5, lightVector);
    if (lightDistance<length(lightPos-point))
     diffuse *= 0.4;
    
    return diffuse;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    
    vec3 rayOrigin = vec3(0.,3.,-3.);
    vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1));
    
    vec3 col = vec3(0);
    
    float dist = rayMarch(rayOrigin, rayDirection);
    vec3 surfacePoint = rayOrigin + rayDirection * dist;
    
    float light = calcLighting(surfacePoint);
    col = vec3(light);
    
    #if (TOGGLE_NORMALS == 1)
    {
        col = vec3(calcNormal(surfacePoint)*(1./dist));
    }
    #endif
 
    #if (TOGGLE_DIST_FIELD == 1)
    {
        dist /= 15.;
        col = vec3(dist);
    }
    #endif
    
    fragColor = vec4(col,1.0);
}