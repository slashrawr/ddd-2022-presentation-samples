#define MAX_STEPS 250
#define MAX_DIST 90.
#define SURF_DIST .00001
#define POINT_LIGHTS 2  
#define AA 1.
#define MOUSE 0
#define LIGHT_ROTATION_SPEED .9
#define GLOBAL_ILLUM 0

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 
  
Material material;

struct DirLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};  

struct PointLight {    
    vec3 position;
    float constant;
    float linear;
    float quadratic;  
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
}; 

DirLight dirLight;
PointLight pointLights[POINT_LIGHTS];

mat2 rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float box(vec3 p, vec3 s) 
{
    p = abs(p)-s;
	return length(max(p, 0.))+min(max(p.x, max(p.y, p.z)), 0.);
}

float sphere(vec3 p, float r) 
{
    return length(p)-r;
}

float theD(vec3 point) 
{
    float beam = box(point, vec3(.6, 1.9, .5));
    float sphere = sphere(point-vec3(.2,0,0), 2.0);
    float bellymask = box(point-vec3(1.2,0,0), vec3(1,1.9,0.5));
    return min(beam,max(sphere, bellymask));
}

float theO(vec3 point)
{
    float mainO = sphere(point-vec3(0., 1., 0.), 6.0);
    float hole = sphere(point-vec3(0., 1., 0.), 5.0);
    float mask = box(point,vec3(7.0, 7.0, .5));
    return max(max(mainO, -hole), mask);
}


float theFloor(vec3 point) 
{ 
    float split = 5.;
    float x = floor(point.x/split);
    float z = floor(point.z/split);
    float bump = sin(x*iTime/2.)*sin(z*iTime/5.)+sin(x*z*iTime/4.);

    return point.y+6.0-clamp(bump,.6,1.);
}

vec3 calcFloorColour(vec3 point)
{
    float split = 5.;
    float x = floor(point.x/split);
    float z = floor(point.z/split);
    
    float bump = sin(x*iTime/2.)*sin(z*iTime/5.)+sin(x*z*iTime/4.);
    vec3 colour = vec3(clamp(bump,.0,1.));
    //colour += (sin(point.z/split)/sin(point.x/split))/(atan(iTime/.2));
    return colour;
}

float theBackground(vec3 point)
{
    float backWall = length(point.z-35.);
    float leftWall = point.x+35.;
    
    float x = floor(point.x/5.);
    float y = floor(point.y/5.);
    
    float bump = sin(x*iTime/2.)*sin(y*iTime/5.)-cos(x*y*iTime*.4);
    //backWall -= clamp(bump,.1,1.);
    
    return min(backWall, leftWall);
}

vec3 calcBackgroundColour(vec3 point)
{
    float a = sin(point.y/2.)+sin((point.x/10.)-iTime);
    float b = sin(point.y/.2)+sin((point.z/10.)-iTime);
    
    return vec3((a+b));
}

vec2 getDist(vec3 point) 
{
    vec2 ret = vec2(0,-1);
    
    float plane = theFloor(point);
   
    float d1 = theD(point+vec3(-2,-1,0));
    float d2 = theD(point+vec3(0,-1,.1));
    float d3 = theD(point+vec3(2,-1,.2));
    
    float o = theO(point);
    
    float background = theBackground(point);
    
    //float d = min(plane, min(o, min(d1, min(d2, d3))));
    float d = min(background, min(plane, min(o, min(d1, min(d2, d3)))));
    
    if (d == plane)
        ret = vec2(d, 0);
    else if (d == d1)
        ret = vec2(d, 1);
    else if (d == d2)
        ret = vec2(d, 2);
    else if (d == d3)
        ret = vec2(d, 3);
    else if (d == o)
        ret = vec2(d, 4);
    else if (d == background)
        ret = vec2(d, 5);
    else
        ret = vec2(d, -1);
    
    return ret;
}

vec2 rayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    vec2 ret = vec2(0);
    
    for(int i=0; i<MAX_STEPS; i++) 
    {
    	vec3 p = ro + rd*dO;
        vec2 dS = getDist(p);
        dO += dS.x;
        ret = dS;
        if(dO>MAX_DIST || dS.x<SURF_DIST) 
            break;
    }
    ret.x = dO;
    return ret;
}

vec3 getNormal(vec3 point) {
	vec2 dist = getDist(point);
    vec2 epsilon = vec2(.001, 0);
    
    return normalize(dist.x - vec3(
        getDist(point-epsilon.xyy).x,
        getDist(point-epsilon.yxy).x,
        getDist(point-epsilon.yyx).x));
}



vec3 getColor(int id, vec3 point)
{
    vec3 col = vec3(0);
    
    switch (id)
    {
        //plane
        case 0: col = calcFloorColour(point);
                break;
        //d1
        case 3: col = vec3(.9);
                break;
        //d2
        case 2: col = vec3(.9);
                break;
        //d3
        case 1: col = vec3(.9);
                break;
        //circle
        case 4: col = vec3(1);
                break;
        //background
        case 5: col = calcBackgroundColour(point);
                break;
    }
    
    return col;
}


vec3 calcDirLight(DirLight light, vec3 normal, vec3 viewDir, vec3 colour)
{
    vec3 lightDir = normalize(-light.direction);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // combine results
    vec3 ambient  = light.ambient  * colour;
    vec3 diffuse  = light.diffuse  * diff * colour;
    vec3 specular = light.specular * spec * colour;
    return (ambient + diffuse + specular);
}  

vec3 calcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 colour)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = dot(normal, lightDir);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float dist    = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * dist + light.quadratic * (dist * dist));    
    // combine results
    vec3 ambient  = light.ambient  * colour;
    vec3 diffuse  = light.diffuse  * diff * colour;
    vec3 specular = light.specular * spec * colour;
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
} 

vec3 calcRayDirection(vec2 uv, vec3 point, vec3 l, float z) {
    vec3 f = normalize(l-point),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = point+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-point);
    return d;
}

void setupLights()
{ 
    material.shininess = 64.;
    vec3 lightStartingPos = vec3(0,1,0);
    float linearFalloff = .01;
    float quadraticFalloff = .0095;
    float lightOrbit = 18.;

    dirLight.direction = vec3(.5,.25,-.1);
    dirLight.ambient = vec3(.2,.2,.2);
    dirLight.diffuse = vec3(.2,.2,.2);
    dirLight.specular = vec3(.1,.1,.1);
    
    //Blue light
    PointLight light1;
    light1.position = lightStartingPos;
    light1.position.x += sin(iTime/LIGHT_ROTATION_SPEED) * lightOrbit;
    light1.position.z += cos(iTime/LIGHT_ROTATION_SPEED) * lightOrbit;
    light1.constant = .01;
    light1.linear = linearFalloff;
    light1.quadratic = quadraticFalloff;
    light1.ambient = vec3(.1, .7, .95);
    light1.diffuse = vec3(.1, .7, .95);
    light1.specular = vec3(.1, .7, .95);
    
    //Pink light
    PointLight light2;
    light2.position = lightStartingPos;
    light2.position.x -= sin(iTime/LIGHT_ROTATION_SPEED) * lightOrbit;
    light2.position.z -= cos(iTime/LIGHT_ROTATION_SPEED) * lightOrbit;
    light2.constant = .01;
    light2.linear = linearFalloff;
    light2.quadratic = quadraticFalloff;
    light2.ambient = vec3(.94,.3,.8);
    light2.diffuse = vec3(.94,.3,.8);
    light2.specular = vec3(.94,.3,.8);
    
    pointLights[0] = light1;
    pointLights[1] = light2; 
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    setupLights();
    vec3 colour = vec3(0);
    
    for(float m = 0.;m<AA;m++)
    {
    	for(float n = 0.;n<AA;n++)
        {
    		vec2 uv = (fragCoord+(vec2(m,n)/AA)-(iResolution.xy*.5))/iResolution.x;
            
            vec2 mouse = iMouse.xy/iResolution.xy;

            vec3 rayOrigin = vec3(0, 4, -30);
            vec3 lookAt = vec3(0,1,0);
            
            if (MOUSE == 1)
            {
                rayOrigin.yz *= rotate(-mouse.y*7.);
                rayOrigin.xz *= rotate(-mouse.x*14.);
            }
            else
                rayOrigin.xz *= rotate(.1*6.2831);

            vec3 rayDirection = calcRayDirection(uv, rayOrigin, lookAt, 1.);

            vec2 dist = rayMarch(rayOrigin, rayDirection);

            if(dist.x<MAX_DIST) 
            {
                vec3 point = rayOrigin + rayDirection * dist.x;
                vec3 normal = getNormal(point);
                colour = getColor(int(dist.y), point);
                vec3 result = vec3(0);
                if (GLOBAL_ILLUM == 1)
                    result = calcDirLight(dirLight, normal, rayDirection, colour);
                
                for(int i = 0; i < POINT_LIGHTS; i++)
                    result += calcPointLight(pointLights[i], normal, point, rayDirection, colour);

                colour = result;    
            }
    	}
    }
    colour/=AA*AA;
    fragColor = vec4(colour, 1.0);
}