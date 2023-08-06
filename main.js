// Time Keeper Class for timing the Render Latency
class TimeKeeper
{
    StartTime;
    EndTime;

    constructor()
    {
        this.StartTime = performance.now();
    }
    diff()
    {
        this.EndTime = performance.now();
        return this.EndTime-this.StartTime
    }
}

// Mathematics
class Vector4
{
    data;

    constructor()
    {
        this.data = new Array(4);
    }

    set(x,y,z,w)
    {
        this.data[0] = x;
        this.data[1] = y;
        this.data[2] = z;
        this.data[3] = w;
    }

    setvec(vec)
    {
        for (let i = 0; i < 4; ++i)
        {
            this.data[i] = vec.data[i];
        }
    }

    negative()
    {
        const vec = new Vector4();
        vec.setvec(this);
        for (let i = 0; i < 4; ++i)
        {
            vec.data[i] = -this.data[i];
        }
        return vec;
    }

    add(other)
    {
        const vec = new Vector4();
        vec.setvec(this);
        for (let i = 0; i < 4; ++i)
        {
            vec.data[i] += other.data[i];
        }
        return vec;
    }

    sub(other)
    {
        return this.add(other.negative());
    }

    muls(scalar)
    {
        const vec = new Vector4();
        vec.setvec(this);
        for (let i = 0; i < 4; ++i)
        {
            vec.data[i] *= scalar;
        }
        return vec;
    }

    // Perform the dot product on the current and other vector, returns a float
    dot(otherVec)
    {
        const x = this.data[0] * otherVec.data[0];
        const y = this.data[1] * otherVec.data[1];
        const z = this.data[2] * otherVec.data[2];
        const w = this.data[3] * otherVec.data[3];
        return x + y + z + w;
    }
}

// Constant for Converting RADIANS and DEGREES
const rad_conversion_number = 180 / Math.PI;

function DegToRad(deg)
{
    return deg / rad_conversion_number;
}

function RadToDeg(rad)
{
    return rad * rad_conversion_number;
}

class Matrix4x4
{
    data;

    constructor()
    {
        this.data = new Array(4);
        for (let i = 0; i < 4; ++i)
        {
            this.data[i] = new Vector4();
        }
        this.identity();
    }

    setmat(mat)
    {
        for (let i = 0; i < 4; ++i)
        {
            this.data[i].setvec(mat.data[i]);
        }
    }

    add(otherMatrix)
    {
        const mat = new Matrix4x4();
        mat.setmat(this);
        for (let i = 0; i < 4; ++i)
        {
            mat.data[i] = this.data[i].add(otherMatrix.data[i]);
        }
        return mat;
    }
    sub(otherMatrix)
    {
        const mat = new Matrix4x4();
        mat.setmat(this);
        for (let i = 0; i < 4; ++i)
        {
            mat.data[i] = this.data[i].sub(otherMatrix.data[i]);
        }
        return mat;
    }
    muls(scalar)
    {
        const mat = new Matrix4x4();
        mat.setmat(this);
        for (let i = 0; i < 4; ++i)
        {
            mat.data[i].muls(scalar);
        }
        return mat;
    }

    // Makes Current Matrix an Identity Matrix
    identity()
    {
        for (let i = 0; i < 4; ++i)
        {
            for (let j = 0; j < 4; ++j)
            {
                this.data[i].data[j] = 0;
            }
        }
        this.data[0].data[0] = 1;
        this.data[1].data[1] = 1;
        this.data[2].data[2] = 1;
        this.data[3].data[3] = 1;
    }
    mulm(otherMatrix)
    {
        const mat = new Matrix4x4();
        mat.setmat(this);
        
        const a1 = new Vector4;
        a1.set(this.data[0].data[0],
            this.data[1].data[0],
            this.data[2].data[0],
            this.data[3].data[0]);
        const a2 = new Vector4;
        a2.set(this.data[0].data[1],
            this.data[1].data[1],
            this.data[2].data[1],
            this.data[3].data[1]);
        const a3 = new Vector4;
        a3.set(this.data[0].data[2],
            this.data[1].data[2],
            this.data[2].data[2],
            this.data[3].data[2]);
        const a4 = new Vector4;
        a4.set(this.data[0].data[3],
            this.data[1].data[3],
            this.data[2].data[3],
            this.data[3].data[3]);

        const b1 = otherMatrix.data[0];
        const b2 = otherMatrix.data[1];
        const b3 = otherMatrix.data[2];
        const b4 = otherMatrix.data[3];

        mat.data[0].data[0] = a1.dot(b1);
        mat.data[0].data[1] = a2.dot(b1);
        mat.data[0].data[2] = a3.dot(b1);
        mat.data[0].data[3] = a4.dot(b1);

        mat.data[1].data[0] = a1.dot(b2);
        mat.data[1].data[1] = a2.dot(b2);
        mat.data[1].data[2] = a3.dot(b2);
        mat.data[1].data[3] = a4.dot(b2);

        mat.data[2].data[0] = a1.dot(b3);
        mat.data[2].data[1] = a2.dot(b3);
        mat.data[2].data[2] = a3.dot(b3);
        mat.data[2].data[3] = a4.dot(b3);

        mat.data[3].data[0] = a1.dot(b4);
        mat.data[3].data[1] = a2.dot(b4);
        mat.data[3].data[2] = a3.dot(b4);
        mat.data[3].data[3] = a4.dot(b4);
        
        return mat;
    }
    translate(x,y,z)
    {
        const tempMatrix = new Matrix4x4();

        tempMatrix.data[3].data[0] += x;
        tempMatrix.data[3].data[1] += y;
        tempMatrix.data[3].data[2] += z;

        return this.mulm(tempMatrix);
    }
    rotateX(x)
    {
        const tempMatrix = new Matrix4x4();

        tempMatrix.data[1].data[1] = Math.cos(x);
        tempMatrix.data[1].data[2] = -Math.sin(x);
        tempMatrix.data[2].data[1] = Math.sin(x);
        tempMatrix.data[2].data[2] = Math.cos(x);

        return this.mulm(tempMatrix);
    }
    rotateY(y)
    {
        const tempMatrix = new Matrix4x4();

        tempMatrix.data[0].data[0] = Math.cos(y);
        tempMatrix.data[0].data[2] = Math.sin(y);
        tempMatrix.data[2].data[0] = -Math.sin(y);
        tempMatrix.data[2].data[2] = Math.cos(y);

        return this.mulm(tempMatrix);
    }
    rotateZ(z)
    {
        const tempMatrix = new Matrix4x4();

        tempMatrix.data[0].data[0] = Math.cos(z);
        tempMatrix.data[0].data[1] = Math.sin(z);
        tempMatrix.data[1].data[0] = -Math.sin(z);
        tempMatrix.data[1].data[1] = Math.cos(z);

        return this.mulm(tempMatrix);
    }

    scale(x,y,z)
    {
        const tempMatrix = new Matrix4x4();

        tempMatrix.data[0].data[0] *= x;
        tempMatrix.data[1].data[1] *= y;
        tempMatrix.data[2].data[2] *= z;

        return this.mulm(tempMatrix);
    }

    // Returns the Matrix4x4 as a 16 Length Single Data Array instead of a 4 Length Vector4 Array
    straight()
    {
        const array = Array(16);
        for (let i = 0; i < 4; ++i)
        {
            for (let j = 0; j < 4; ++j)
            {
                array[j + (i*4)] = this.data[i].data[j];
            }
        }
        return array;
    }

    // Makes this Matrix4x4 a Frustum Matrix
    frustum(bottom,left,top,right,near,far)
    {
        const mat = new Matrix4x4();
        mat.setmat(this);
        
        mat.data[0].data[0] = 2 * near / (right-left);
        mat.data[0].data[1] = 0;
        mat.data[0].data[2] = 0;
        mat.data[0].data[3] = 0;

        mat.data[1].data[0] = 0;
        mat.data[1].data[1] = 2 * near / (top-bottom);
        mat.data[1].data[2] = 0;
        mat.data[1].data[3] = 0;

        mat.data[2].data[0] = (right + left) / (right - left);
        mat.data[2].data[1] = (top + bottom) / (top - bottom);
        mat.data[2].data[2] = -(far + near) / (far - near);
        mat.data[2].data[3] = -1;

        mat.data[3].data[0] = 0;
        mat.data[3].data[1] = 0;
        mat.data[3].data[2] = -2 * far * near / (far - near);
        mat.data[3].data[3] = 0;
        
        return mat;
    }

    perspective(near, far, fov, aspect)
    {
        const mat = new Matrix4x4();

        const tanhalffov = Math.tan(fov/2.0);
        mat.data[0].data[0] = 1.0 / (aspect * tanhalffov);
        mat.data[1].data[1] = 1.0 / tanhalffov;
        mat.data[2].data[2] = far / (near - far);
        mat.data[2].data[3] = -1.0;
        mat.data[3].data[2] = -(far*near) / (far-near);

        // I forgot the source
        //const scale = Math.tan(fov * 0.5 * Math.PI / 180) * near;
        //const right = aspect * scale;
        //const left = -right;
        //const top = scale;
        //const bottom = -scale;
        //mat.setmat(this.frustum(bottom,left,top,right,near,far));
        
        return mat;
    }

    lookAt(eye,center,up)
    {
        const mat = new Matrix4x4();
        mat.identity();

        const f = (center.sub(eye)).normalized();
        const s = (f.cross(up)).normalized();
        const u = s.cross(f);
        mat.data[0].data[0] = s.data[0];
        mat.data[1].data[0] = s.data[1];
        mat.data[2].data[0] = s.data[2];

        mat.data[0].data[1] = u.data[0];
        mat.data[1].data[1] = u.data[1];
        mat.data[2].data[1] = u.data[2];

        mat.data[0].data[2] =-f.data[0];
        mat.data[1].data[2] =-f.data[1];
        mat.data[2].data[2] =-f.data[2];

        mat.data[3].data[0] =-s.dot(eye);
        mat.data[3].data[1] =-u.dot(eye);
        mat.data[3].data[2] = f.dot(eye);

        return mat;
    }
}

class Vector3
{
    data;

    constructor()
    {
        this.data = new Array(3);
        for (let i = 0; i < 3; ++i)
        {
            this.data[i] = 0;
        }
    }

    static getvec(x,y,z)
    {
        const vec = new Vector3();
        vec.set(x,y,z);
        return vec;
    }

    set(x,y,z)
    {
        this.data[0] = x;
        this.data[1] = y;
        this.data[2] = z;
    }

    setvec(vec)
    {
        this.data[0] = vec.data[0];
        this.data[1] = vec.data[1];
        this.data[2] = vec.data[2];
    }

    negate()
    {
        for (let i = 0; i < 3; ++i)
        {
            this.data[i] = -this.data[i];
        }
    }

    negative()
    {
        const vec = new Vector3();
        for (let i = 0; i < 3; ++i)
        {
            vec.data[i] = -this.data[i];
        }
        return vec;
    }

    add(other)
    {
        const vec = new Vector3();
        vec.setvec(this);
        for (let i = 0; i < 3; ++i)
        {
            vec.data[i] += other.data[i];
        }
        return vec;
    }
    sub(other)
    {
        const vec = new Vector3();
        vec.setvec(this);
        for (let i = 0; i < 3; ++i)
        {
            vec.data[i] -= other.data[i];
        }
        return vec;
    }

    divs(scalar)
    {
        const vec = new Vector3();
        vec.setvec(this);
        for (let i = 0; i < 3; ++i)
        {
            vec.data[i] /= scalar;
        }
        return vec;
    }

    length()
    {
        const x = this.data[0]*this.data[0];
        const y = this.data[1]*this.data[1];
        const z = this.data[2]*this.data[2];

        return Math.sqrt(x+y+z);
    }

    normalize()
    {
        const length = this.length();
        const vec = this.divs(length);
        for (let i = 0; i < 3; ++i)
        {
            this.data[i] = vec.data[i];
        }
    }

    normalized()
    {
        const length = this.length();
        return this.divs(length);
    }

    cross(other)
    {
        const temp = new Vector3();
        temp.data[0] = (this.data[1]*other.data[2])-(this.data[2]*other.data[1]);
        temp.data[1] = (this.data[2]*other.data[0])-(this.data[0]*other.data[2]);
        temp.data[2] = (this.data[0]*other.data[1])-(this.data[1]*other.data[0]);
        return temp;
    }

    dot(other)
    {
        const x = this.data[0] * other.data[0];
        const y = this.data[1] * other.data[1];
        const z = this.data[2] * other.data[2];

        return x + y + z;
    }
}

// Update the Frame Time HTML Element
function UpdateFrameTime(frameTime)
{
    const frame_time = document.querySelector("#frame-time");
    frame_time.innerText = frameTime;
}

// Global Window Properties
let real_window_width = 75.0;
let real_window_height = (real_window_width/16.0)*9.0;

// General Graphics Objects/Variables
class Camera
{
    position;
    center;
    up;
    projection;

    constructor()
    {
        this.position = new Vector3();
        this.center = new Vector3();
        this.up = new Vector3();
        this.position.set(0,0,1);
        this.center.set(0,0,0);
        this.up.set(0,1,0);
    }

    getView()
    {
        return new Matrix4x4().lookAt(this.position,this.center,this.up);
    }
}

const camera = new Camera();

// WebGL Rendering
let current_width_GL = 800;
let current_height_GL = 600;

let glContext = null;
let shaderProgram = null;
let shaderInfo = {
    program: shaderProgram,
    attributeLocations:
        {
            vertexPositions: null,
            vertexColors: null
        },
    uniformLocations:
        {
            transformMatrix: null
        }
};
let modelBuffer = null; // Model Vertex Buffer
let colorBuffer = null; // Color Buffer
let indexBuffer = null; // Index Buffer

const vertexShader = `
attribute vec3 position;
attribute vec4 color;
uniform mat4 transform;

varying lowp vec4 fragColor;
void main()
{
    gl_Position = transform * vec4(position,1);
    fragColor = color;
}
`;
const fragmentShader = `
varying lowp vec4 fragColor;
void main()
{
gl_FragColor = fragColor;
}
`;
const positions = [
    -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
    -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
    0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
];

const indices = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
];

const faceColors = [
    [1.0, 1.0, 1.0, 1.0], [1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0], [1.0, 1.0, 0.0, 1.0], [1.0, 0.0, 1.0, 1.0],
];

let translation = new Vector3(); translation.set(0,0,0);
let rotation = new Vector3(); rotation.set(0,0,0);
let scale = new Vector3(); scale.set(1,1,1);

function SwitchWindow_WebGL()
{
    // Hide Grid Window
    const grid_window = document.querySelector("#grid-window");
    grid_window.style.display = "none";

    // Show Canvas Element
    const canvas = document.querySelector("#webgl-window");
    canvas.style.display = "block";
}

function ResizeWindow_WebGL(width, height)
{
    // Fetch Canvas
    const canvas = document.querySelector("#webgl-window");
    // Set Canvas Width and Height
    canvas.width = width.toString();
    canvas.height = height.toString();
    // Save New Values
    current_width_GL = width;
    current_height_GL = height;
}

function InitializeWindow_WebGL()
{
    // Get HTML Canvas Element
    const canvas = document.querySelector("#webgl-window");

    // Resize Canvas to default resolution
    canvas.width = current_width_GL.toString();
    canvas.height = current_height_GL.toString();

    // Fetch WebGL Context from Canvas, Try WebGL2 then WebGL1
    glContext = canvas.getContext("webgl2");
    if (glContext === null)
    {
        console.log("NULL glContext, Cannot Continue");
        console.log("Unable to Initialize WebGL2");
        glContext = canvas.getContext("webgl");
        if (glContext === null)
        {
            console.log("NULL glContext, Cannot Continue");
            console.log("Unable to Initialize WebGL1");
            return;
        }
    }

    // Create and Compile Vertex and Fragment Shaders
    let vShader = glContext.createShader(glContext.VERTEX_SHADER);
    let fShader = glContext.createShader(glContext.FRAGMENT_SHADER);
    // Provide Shader Source Code for
    glContext.shaderSource(vShader,vertexShader); // Vertex Shader
    glContext.shaderSource(fShader,fragmentShader); // Fragment Shader

    // Compile Shaders
    glContext.compileShader(vShader);
    if (!glContext.getShaderParameter(vShader,glContext.COMPILE_STATUS))
    {
        console.log(`Vertex Shader Compilation Failed | ERROR: ${glContext.getShaderInfoLog(vShader)}`);
        glContext.deleteShader(vShader);
        return;
    }

    glContext.compileShader(fShader);
    if (!glContext.getShaderParameter(fShader,glContext.COMPILE_STATUS))
    {
        console.log(`Fragment Shader Compilation Failed | ERROR: ${glContext.getShaderInfoLog(fShader)}`);
        glContext.deleteShader(fShader);
        return;
    }

    // Create and Link Shader Program
    shaderProgram = glContext.createProgram(); // Create Program
    glContext.attachShader(shaderProgram,vShader); // Attach Vertex Shader
    glContext.attachShader(shaderProgram,fShader); // Attach Fragment Shader
    glContext.linkProgram(shaderProgram); // Link to Program

    // Linking Error Checking
    if (!glContext.getProgramParameter(shaderProgram,glContext.LINK_STATUS))
    {
        console.log(`Failed to Link Shader Program | ERROR: ${glContext.getProgramInfoLog(shaderProgram)}`)
    }
    glContext.useProgram(shaderProgram); // Use as WebGL Shader Program

    // Store Shader Information
    shaderInfo.program = shaderProgram;
    shaderInfo.attributeLocations.vertexPositions = glContext.getAttribLocation(shaderProgram,"position");
    shaderInfo.attributeLocations.vertexColors = glContext.getAttribLocation(shaderProgram,"color");
    shaderInfo.uniformLocations.transformMatrix = glContext.getUniformLocation(shaderProgram,"transform");

    let colors = [];

    for (let j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }

    // Creating Square Buffer
    modelBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER,modelBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER,new Float32Array(positions),glContext.STATIC_DRAW);

    // Creating Color Buffer
    colorBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER,colorBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER,new Float32Array(colors),glContext.STATIC_DRAW);

    // Creating Index Buffer
    indexBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER,indexBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),glContext.STATIC_DRAW);

    // Clear the screen
    glContext.clearColor(0,0,0,1);
    glContext.clearDepth(1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.depthFunc(glContext.LEQUAL);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    // Define the amount of points per Vertices | Vec2 Vertices
    const pointsPerVertex = 3;
    glContext.bindBuffer(glContext.ARRAY_BUFFER, modelBuffer);
    glContext.vertexAttribPointer(shaderInfo.attributeLocations.vertexPositions,
        pointsPerVertex,
        glContext.FLOAT,
        false,
        0,0);
    glContext.enableVertexAttribArray(shaderInfo.attributeLocations.vertexPositions);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(shaderInfo.attributeLocations.vertexColors,
        4,
        glContext.FLOAT,
        false,0,0);
    glContext.enableVertexAttribArray(shaderInfo.attributeLocations.vertexColors);

    // Initialize Camera
    camera.projection = new Matrix4x4();
    camera.projection = camera.projection.perspective(0.1,1000,60,16.0/9.0);
}

function DrawSquare_WebGL(position,rotation,scale)
{
    // Model Matrix
    let model = new Matrix4x4();
    model = model.translate(position.data[0],position.data[2],position.data[2]);
    model = model.rotateX(DegToRad(rotation.data[0]));
    model = model.rotateY(DegToRad(rotation.data[1]));
    model = model.rotateZ(DegToRad(rotation.data[2]));
    model = model.scale(scale.data[0],scale.data[1],scale.data[2]);

    // MVP Matrix
    let mvp = new Matrix4x4();
    mvp.identity();
    mvp = mvp.mulm(camera.projection);
    mvp = mvp.mulm(camera.getView());
    mvp = mvp.mulm(model);

    // Upload MVP Matrix to GPU
    glContext.uniformMatrix4fv(
        shaderInfo.uniformLocations.transformMatrix,
        false,
        mvp.straight()
    );
    // Draw Cube
    glContext.drawElements(glContext.TRIANGLES,indices.length,glContext.UNSIGNED_INT,0);
}

function DrawImage_WebGL()
{
    const time_keeper = new TimeKeeper();

    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    // Draw the Cube | Function Name inaccurate
    DrawSquare_WebGL(translation,rotation,scale);

    UpdateFrameTime(time_keeper.diff());
}

// Initialize Graphics Rendering Part of Webpage
// ResizeWindow_Real();
InitializeWindow_WebGL();
//InitializeWindow_Grid();
DrawImage_WebGL();
//SwitchWindow();

// Side Info Tab
const tab_puller = document.querySelector("#info-side-tab-puller");
let tab_puller_grower = null;
let tab_puller_shrinker = null;
const tab_puller_maxsize = 70;
const tab_puller_defaultsize = 40;
tab_puller.style.fontsize = tab_puller_defaultsize;
const shrink = () => // Animation Function to Push Tab Away from sight
{
    //console.log("FONTSIZE: " + tab_puller.style.fontSize);
    //console.log("FONTSIZE: " + tab_puller.style.fontsize.toString());
    if (Number(tab_puller.style.fontsize) !== tab_puller_defaultsize)
        //tab_puller.style.fontSize = (Number(tab_puller.style.fontSize) - 1).toString();
        --tab_puller.style.fontsize;
    else clearInterval(tab_puller_shrinker);
    tab_puller.style.fontSize = tab_puller.style.fontsize.toString() +'px';
}
const grow = () => // Animation Function to Pull Tab into Sight
{
    //console.log("FONTSIZE: " + tab_puller.style.fontSize);
    //console.log("FONTSIZE: " + tab_puller.style.fontsize.toString());
    if (tab_puller.style.fontsize !== tab_puller_maxsize)
        //tab_puller.style.fontSize = (Number(tab_puller.style.fontSize) + 1).toString();
        ++tab_puller.style.fontsize;
    else clearInterval(tab_puller_grower);
    tab_puller.style.fontSize = tab_puller.style.fontsize.toString() +'px';
}
tab_puller.onmouseenter = () => { clearInterval(tab_puller_shrinker); tab_puller_grower = setInterval(grow,10); };
tab_puller.onmouseleave = () => { clearInterval(tab_puller_grower); tab_puller_shrinker = setInterval(shrink,10); };

const whole_tab = document.querySelector("#info-side-tab");
const info_tab = document.querySelector("#info-side-tab-content-holder");
let tab_offset= 0;
let tab_appear_offset = 0;
let whole_tab_opener = null;
let whole_tab_closer = null;
const openrate = 15;
function ResizeTab() // Recalculate The CSS values
{ whole_tab.style.left = "calc(100vw - " + tab_appear_offset.toString() + "px - " + tab_offset.toString() + "px)"; }
function OpenInfoTab() // Open the info tab on click
{
    console.log("OPEN");
    tab_puller.onclick = CloseInfoTab;
    clearInterval(whole_tab_closer);
    whole_tab_opener = setInterval(()=>{
        console.log("OPENING")
        if (tab_offset < info_tab.offsetWidth)
            tab_offset += openrate;
        else clearInterval(whole_tab_opener);
        ResizeTab();
    },10);
}
function CloseInfoTab() // Close on Click
{
    console.log("CLOSE");
    tab_puller.onclick = OpenInfoTab;
    clearInterval(whole_tab_opener);
    whole_tab_closer = setInterval(()=>{
        console.log("CLOSING")
        if (tab_offset > 0)
            tab_offset -= openrate;
        else clearInterval(whole_tab_closer);
        ResizeTab();
    },10);
}
let tab_puller_appearer = null;
let tab_puller_disappearer = setInterval(()=>{
    clearInterval(tab_puller_disappearer);
},10);
function AppearTabPuller() // Open Tab
{
    clearInterval(tab_puller_disappearer);
    clearInterval(tab_puller_appearer);
    tab_puller_appearer = setInterval(()=>{
        console.log("A: "+tab_appear_offset.toString());
        if (tab_appear_offset < 80)
            ++tab_appear_offset;
        else clearInterval(tab_puller_appearer);
        ResizeTab();
    },10);
}
function DisappearTabPuller() // Close Tab
{
    clearInterval(tab_puller_disappearer);
    clearInterval(tab_puller_appearer);
    tab_puller_disappearer = setInterval(()=>{
        console.log("B: "+tab_appear_offset.toString());
        if (tab_appear_offset > 0)
            --tab_appear_offset;
        else clearInterval(tab_puller_disappearer);
        ResizeTab();
    },10);
}
tab_puller.onclick = OpenInfoTab;
ResizeTab();

// Info Slides
const slidesection = document.querySelector("#info-slides");
let activeslide = 0;
const activeDisplay = "flex";
const inactiveDisplay = "none";
let lastActiveTab = document.querySelector("#info-side-tab-content-holder").children[0];

const killElement = (event) => // Kill the previous HTML Slide to prepare for the next slide
{
    event.target.style.display = "none";
    const slides = slidesection.children;
    slides[activeslide].style.display = activeDisplay;
    slides[activeslide].style.whiteSpace = "normal";
};

function DetermineSlideRequest(request) // See if there is a slide to switch to
{
    if (request !== null)
    {
        const infotab = document.querySelector("#info-side-tab-content-holder");
        const infos = infotab.querySelectorAll(".need-a-question-mark-on-the-right-side-of-the-screen-marker-class");
        for (let i = 0; i < infos.length; ++i)
        {
            lastActiveTab.style.display = "none";
            if (infos[i].innerText === request.innerText)
                infos[i].parentElement.style.display = "block";
            else continue;
            lastActiveTab = infos[i].parentElement;
            console.log("MATCH");
            console.log(lastActiveTab);
            AppearTabPuller();
            return;
        }
    } else
    {
        CloseInfoTab();
        DisappearTabPuller();
    }
}
function SwitchSlide(button) // Handle Animations between Switching Slides
{
    const slides = slidesection.children;

    if (activeslide + button.currentTarget.increment < 0 || activeslide + button.currentTarget.increment >= slides.length)
    {
        console.log("ERROR: Switching to non-existent slide");
        return;
    }

    console.log(activeslide + button.currentTarget.increment);
    slides[activeslide].style.animationName = "fade-out";
    slides[activeslide].style.whiteSpace = "nowrap";
    slides[activeslide].addEventListener("animationend", killElement);
    //slides[activeslide + button.currentTarget.increment].style.display = "block";
    slides[activeslide + button.currentTarget.increment].style.animationName = "fade-in";
    slides[activeslide + button.currentTarget.increment].removeEventListener("animationend", killElement);
    activeslide = activeslide + button.currentTarget.increment;
    localStorage.setItem("Page",activeslide.toString());
    const request = slides[activeslide].querySelector(".need-a-question-mark-on-the-right-side-of-the-screen-marker-class");
    DetermineSlideRequest(request);
}

function InitializeSlides() // Set all but one Slide to Visible
{
    const storage = localStorage.getItem("Page");
    if (storage !== null)
    {
        activeslide = Number(storage);
    }

    const slides = slidesection.children;
    for (let i = 0; i < slides.length; ++i)
    {
        slides[i].style.display = inactiveDisplay;
        slides[i].style.animationName = "fade-out";
        slides[i].addEventListener("animationend",killElement);
    }

    slides[activeslide].style.display = activeDisplay;
    slides[activeslide].style.animationName = "fade-in";
    slides[activeslide].removeEventListener("animationend",killElement);

    const leftbutton = document.querySelector("#left-slide");
    const rightbutton = document.querySelector("#right-slide");
    leftbutton.addEventListener("click",SwitchSlide);
    leftbutton.increment = -1;
    rightbutton.addEventListener("click",SwitchSlide);
    rightbutton.increment = 1;

    const sidepanels = document.querySelector("#info-side-tab-content-holder").children;
    for (let i = 0; i < sidepanels.length; ++i) sidepanels[i].style.display = "none";
    const request = slides[activeslide].querySelector(".need-a-question-mark-on-the-right-side-of-the-screen-marker-class");
    if (request !== null)
    {
        const infotab = document.querySelector("#info-side-tab-content-holder");
        const infos = infotab.querySelectorAll(".need-a-question-mark-on-the-right-side-of-the-screen-marker-class");
        for (let i = 0; i < infos.length; ++i)
        {
            lastActiveTab.style.display = "none";
            if (infos[i].innerText === request.innerText)
                infos[i].parentElement.style.display = "block";
            else continue;
            lastActiveTab = infos[i].parentElement;
            console.log("MATCH");
            console.log(lastActiveTab);
            AppearTabPuller();
            return;
        }
    }
}

InitializeSlides();

const transformSelector = document.querySelector("#transform");
transformSelector.value = "1";
const moveX = (x)=>{ translation.data[0]+=x; }
const moveY = (y)=>{ translation.data[1]+=y; }
const moveZ = (z)=>{ translation.data[2]+=z; }
const rotX = (x)=>{ rotation.data[0]+=x; }
const rotY = (y)=>{ rotation.data[1]+=y; }
const rotZ = (z)=>{ rotation.data[2]+=z; }
const scaleX = (x)=>{ scale.data[0]+=x; }
const scaleY = (y)=>{ scale.data[1]+=y; }
const scaleZ = (z)=>{ scale.data[2]+=z; }

const xup = document.querySelector("#x-up");
const yup = document.querySelector("#y-up");
const zup = document.querySelector("#z-up");
const xdown = document.querySelector("#x-down");
const ydown = document.querySelector("#y-down");
const zdown = document.querySelector("#z-down");
const speedup = document.querySelector("#speed-up");
const speedown = document.querySelector("#speed-down");
const speednumber = document.querySelector("#speed-number");

let speed = 0.2;
speednumber.innerText = (Math.round(speed*100)/100).toString();
speedup.onmousedown =  ()=>{speed+=0.1; speednumber.innerText = (Math.round(speed*100)/100).toString(); }
speedown.onmousedown = ()=>{speed-=0.1; speednumber.innerText = (Math.round(speed*100)/100).toString(); }
const xyzmove = ()=>{ // Change onclick to Translate
    xup.onmousedown =   ()=>{ moveX(speed);  DrawImage_WebGL(); };
    xdown.onmousedown = ()=>{ moveX(-speed); DrawImage_WebGL(); };
    yup.onmousedown =   ()=>{ moveY(speed);  DrawImage_WebGL(); };
    ydown.onmousedown = ()=>{ moveY(-speed); DrawImage_WebGL(); };
    zup.onmousedown =   ()=>{ moveZ(speed);  DrawImage_WebGL(); };
    zdown.onmousedown = ()=>{ moveZ(-speed); DrawImage_WebGL(); };
};
const xyzrot = ()=>{ // Change onclick to Rotate
    xup.onmousedown =   ()=>{ rotX(speed);  DrawImage_WebGL(); };
    xdown.onmousedown = ()=>{ rotX(-speed); DrawImage_WebGL(); };
    yup.onmousedown =   ()=>{ rotY(speed);  DrawImage_WebGL(); };
    ydown.onmousedown = ()=>{ rotY(-speed); DrawImage_WebGL(); };
    zup.onmousedown =   ()=>{ rotZ(speed);  DrawImage_WebGL(); };
    zdown.onmousedown = ()=>{ rotZ(-speed); DrawImage_WebGL(); };
};
const xyzscale = ()=>{ // Change onclick to Scale
    xup.onmousedown =   ()=>{ scaleX(speed);  DrawImage_WebGL(); };
    xdown.onmousedown = ()=>{ scaleX(-speed); DrawImage_WebGL(); };
    yup.onmousedown =   ()=>{ scaleY(speed);  DrawImage_WebGL(); };
    ydown.onmousedown = ()=>{ scaleY(-speed); DrawImage_WebGL(); };
    zup.onmousedown =   ()=>{ scaleZ(speed);  DrawImage_WebGL(); };
    zdown.onmousedown = ()=>{ scaleZ(-speed); DrawImage_WebGL(); };
};

transformSelector.onchange = ()=>{ // Handle Switching Types
    switch (transformSelector.value)
    {
        case "1":
            xyzmove();
            break;
        case "2":
            xyzrot();
            break;
        case "3":
            xyzscale();
            break;
    }
};

xyzmove();

const open_transforms_button = document.querySelector("#open-transforms");
const transforms_panel = document.querySelector("#model-control-panel");
let transforms_opener = null;
let transforms_closer = null;
const transforms_panel_height = transforms_panel.offsetHeight;
let transforms_panel_bottom_margin = transforms_panel_height;
let transforms_open_arrow_scale = 1;
const transforms_apply = ()=>{
    transforms_panel.style.marginBottom = -transforms_panel_bottom_margin.toString() + 'px';
    open_transforms_button.style.transform = "scale(1,"+transforms_open_arrow_scale.toString()+")"
}
const transforms_open = ()=>
{
    clearInterval(transforms_opener);
    clearInterval(transforms_closer);
    transforms_opener = setInterval(()=>{
        if (transforms_panel_bottom_margin > 0)
        {
            transforms_panel_bottom_margin -= transforms_panel_height / 50;
            transforms_open_arrow_scale -= 2/50;
        }
        else clearInterval(transforms_opener);
        transforms_apply();
    },10);
    open_transforms_button.onclick = transforms_close;
}
const transforms_close = ()=>
{
    clearInterval(transforms_opener);
    clearInterval(transforms_closer);
    transforms_closer = setInterval(()=>{
        if (transforms_panel_bottom_margin < transforms_panel_height)
        {
            transforms_panel_bottom_margin += transforms_panel_height / 50;
            transforms_open_arrow_scale += 2/50;
        }
        else clearInterval(transforms_closer);
        transforms_apply();
    },10)
    open_transforms_button.onclick = transforms_open;
}
open_transforms_button.onclick = transforms_open;
transforms_apply();

console.log(camera.projection.straight());
console.log(camera.getView().straight());
let testmodelmatrix = new Matrix4x4();
testmodelmatrix = testmodelmatrix.translate(1,1,1);
testmodelmatrix = testmodelmatrix.rotateX(32);
testmodelmatrix = testmodelmatrix.rotateY(32);
testmodelmatrix = testmodelmatrix.rotateZ(32);
testmodelmatrix = testmodelmatrix.scale(.2,.2,.2);
console.log(testmodelmatrix.straight());
