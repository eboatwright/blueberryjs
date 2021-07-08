/*
         # # # # # # 
     # # # . . . . # # # 
   # # . . . . . . . . # # 
 # # . . # # . . . . . . # # 
 # . . # # # . . . . . . . # 
 # . # # # # . . . . . . . #     # # # # #     # # # # 
 # . # # # . . . . . . . . #         # #     # # # # # 
 # . . . . . . . . . . . . #         # #     # # 
 # # . . . . . . . . . . # #         # #       # # # 
   # # . . . . . . . . # #       #   # #           # # 
     # # # . . . . # # #    #     # #       # # # # # 
         # # # # # #
         
         blueberry.js is a lightweight game framework for making games in JavaScript, HTML5, and CSS3!
*/


// ECS
// COMPONENT CLASS
class Component {
    constructor(id) {
        // INITIALIZE ID
        this.id = id;
    }
}

// ENTITY CLASS
class Entity {
    constructor(id) {
        // INITIALIZE VARIABLES
        this.id = id;
        this.components = [];
        this.destroyed = false;
    }

    destroy() {
        // A HELPER FUNCTION FOR DESTROYING ENTITIES
        this.destroyed = true;
    }

    addComponent(component) {
        // A HELPER FUNCTION FOR ADDING COMPONENTS
        this.components.push(component);
        return this;
    }

    getComponent(componentID) {
        // LOOP THROUGH EACH COMPONENT
        for(var i = 0; i < this.components.length; i++) // FOREACH ONE, CHECK IF IT MATCHES THE SPECIFIED ID
            if(this.components[i].id == componentID) // IF SO, RETURN THE COMPONENT
                return this.components[i];
        // IF IT DOESN'T HAVE IT, RETURN NULL
        return null;
    }

    hasComponent(componentID) {
        // LOOP THROUGH EACH COMPONENT
        for(var i = 0; i < this.components.length; i++) // FOREACH ONE, CHECK IF IT MATCHES THE SPECIFIED ID
            if(this.components[i].id == componentID) // IF SO, RETURN TRUE
                return true;
        // IF NOT, RETURN FALSE
        return false;
    }
}

// SYSTEM CLASS
class System {
    constructor() {
        // INITIALIZE VARIABLES
        this.requirements = []
    }

    addRequirement(requirement) {
        // A HELPER FUNCTION FOR ADDING REQUIREMENTS
        this.requirements.push(requirement);
    }

    matches(entity) {
        // LOOP THROUGH EACH REQUIREMENT
        for(var i = 0; i < this.requirements.length; i++) // FOREACH ONE, CHECK IF IT DOESN'T HAVE A REQUIREMENT
            if(!entity.hasComponent(this.requirements[i])) // IF SO, IT DOESN'T MATCH
                return false;
        // IF IT PASSES ALL THE REQUIREMENTS, IT MATCHES SO RETURN TRUE
        return true;
    }

    render(entity, context) {
        // OVERRIDE THIS FUNCTION FOR SYSTEM RENDERING
    }
}

// SCENE CLASS
class Scene {
    constructor(id) {
        // INITIALIZE VARIABLES
        this.id = id;
        this.entities = [];
        this.systems = [];
    }

    createEntity(id) {
        // CREATE A TEMPORARY ENTITY
        var entity = new Entity(id);
        // ADD ENTITY TO LIST
        this.entities.push(entity);
        // RETURN ENTITY
        return entity;
    }

    addSystem(system) {
        // ADD SYSTEM TO LIST
        this.systems.push(system);
        // RETURN THIS SCENE (THIS IS USED FOR THE ONE LINE SYSTEM ADD)
        return this;
    }

    render(context) {
        // LOOP THROUGH ENTITY LIST BACKWARDS
        for(var i = this.entities.length - 1; i >= 0; i--) {
            // LOOP THROUGH SYSTEM LIST
            for(var j = 0; j < this.systems.length; j++) {
                // CHECK IF ENTITY IS DESTROYED
                if(this.entities[i].destroyed) // IF SO, REMOVE FROM LIST
                    this.entities.splice(i, 1);
                else // IF NOT CHECK IF ENTITY MATCHES SYSTEM
                    if(this.systems[j].matches(this.entities[i])) // IF SO, RENDER ENTITY WITH SYSTEM AND CONTEXT
                        this.systems[j].render(this.entities[i], context);
            }
        }
    }
}



// VECTOR2 CLASS
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // HELPER FUNCTIONS FOR RETURNING SPECIFIC VECTOR2s
    static ZERO() { return new Vector2(0, 0); }
    static ONE() { return new Vector2(1, 1); }
    static RIGHT() { return new Vector2(0, 1); }
    static UP() { return new Vector2(1, 0); }

    // CALL THIS TO ADD VECTOR2s
    static add(a, b) {
        // CHECK IF "B" IS A NUMBER
        if(typeof(b) == "number") // IF SO, RETURN VECTOR2'S VALUES AS A NEW VECTOR2
            return new Vector2(a.x + b, a.y + b);
        // IF NOT, JUST RETURN A NEW VECTOR2 ADDING THE OTHER VECTOR2'S VALUES
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    // CALL THIS TO SUBTRACT VECTOR2s
    static subtract(a, b) {
        if(typeof(b) == "number")
            return new Vector2(a.x - b, a.y - b);
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    // CALL THIS TO MULTIPLY VECTOR2s
    static multiply(a, b) {
        if(typeof(b) == "number")
            return new Vector2(a.x * b, a.y * b);
        return new Vector2(a.x * b.x, a.y * b.y);
    }

    // CALL THIS TO DIVIDE VECTOR2s
    static divide(a, b) {
        if(typeof(b) == "number")
            return new Vector2(a.x / b, a.y / b);
        return new Vector2(a.x / b.x, a.y / b.y);
    }

    // GET THE MAGNITUDE OF A VECTOR2
    static magnitude(a) {
        return Math.sqrt((a.x * a.x) + (a.y * a.y));
    }

    // NORMALIZE A VECTOR2
    static normalize(a) {
        var mag = Vector2.magnitude(a);
        if(mag > 0)
            return Vector2.divide(a, mag);
        return Vector2.ZERO();
    }
}



// BUILT IN COMPONENTS
class Transform extends Component {
    constructor(position) {
        // SET THIS COMPONENT'S ID
        super("transform");
        // INITIALIZE THIS COMPONENT'S VALUES
        this.position = position;
    }
}

class ImageRenderer extends Component {
    constructor(image) {
        super("imageRenderer");
        this.image = image;
    }
}

class BoxCollider extends Component {
    constructor(size) {
        super("boxCollider");
        this.size = size;
    }
}

class RigidBody extends Component {
    constructor(gravity, friction) {
        super("rigidBody");
        this.gravity = gravity;
        this.friction = friction;
        this.velocity = Vector2.ZERO();
    }
}


// BUILD IN SYSTEMS
class ImageRendererSystem extends System {
    constructor() {
        // SET THIS SYSTEM's ID
        super("imageRendererSystem");
        // SET THIS SYSTEM's REQUIREMENTS
        this.addRequirement("transform");
        this.addRequirement("imageRenderer");
    }

    render(entity, context) {
        // CREATE VARIABLES THAT YOU WILL BE USING
        var transform = entity.getComponent("transform");
        var imageRenderer = entity.getComponent("imageRenderer");

        // DO SYSTEM'S RENDER
        context.drawImage(imageRenderer.image, transform.position.x, transform.position.y);
    }
}

class RigidBodySystem extends System {
    constructor() {
        super("rigidBodySystem");
        this.addRequirement("transform");
        this.addRequirement("rigidBody");
    }

    render(entity, context) {
        var transform = entity.getComponent("transform");
        var rigidBody = entity.getComponent("rigidBody");

        rigidBody.velocity.y += rigidBody.gravity;
        rigidBody.velocity = Vector2.multiply(rigidBody.velocity, rigidBody.friction);
        transform.position = Vector2.add(transform.position, rigidBody.velocity);
    }
}



// VARIABLES
var keyboardInputs = [];
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var currentScene = new Scene("defaultScene");
var scaleFactor = 1;



// KEYBOARD INPUT
function isKeyDown(key) {
    return keyboardInputs[key];
}


// RENDER FUNCTION (CALLED EVERY FRAME)
function renderScene() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    currentScene.render(context);
    requestAnimationFrame(render);
}

// START FUNCTION (CALL THIS AT THE END OF YOUR GAME SCRIPT)
function start(_scaleFactor) {
    scaleFactor = _scaleFactor;

    // OVERRIDE WINDOW RESIZE FUNCTION TO UPDATE CANVAS
    window.onresize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.imageSmoothingEnabled = false;
        context.scale(scaleFactor, scaleFactor);
    }
    window.onresize();

    // OVERRIDE ON KEY UP AND ON KEY DOWN FUNCTIONS
    window.addEventListener("keydown", function(e) {
        if(keyboardInputs[e.key] == null || !keyboardInputs[e.key])
            keyboardInputs[e.key] = true;
    });

    window.addEventListener("keyup", function(e) {
        if(keyboardInputs[e.key])
            keyboardInputs[e.key] = false;
    });

    init();
    render();
}


// CHANGE SCENE FUNCTION (CALL THIS WHEN YOU WANT TO CHANGE YOUR SCENE)
function changeScene(scene) {
    currentScene = scene;
}


// CREATE IMAGE FUNCTION (JUST A HELPER FUNCTION)
function createImage(src) {
    var image = new Image();
    image.src = src;
    return image;
}


// COLLISION
function boxCollidersOverlap(a, b) {
    var aPosition = a.getComponent("transform").position;
    var bPosition = b.getComponent("transform").position;
    var aSize = a.getComponent("boxCollider").size;
    var bSize = b.getComponent("boxCollider").size;

    return (
        aPosition.x < bPosition.x + bSize.x &&
        aPosition.x + aSize.x > bPosition.x &&
        aPosition.y < bPosition.y + bSize.y &&
        aPosition.y + aSize.y > bPosition.y
    );
}