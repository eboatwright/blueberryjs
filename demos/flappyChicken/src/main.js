// COMPONENTS
class Chicken extends Component {
    constructor(flapHeight) {
        super("chicken");
        this.flapHeight = flapHeight;
        this.started = false;
        this.flapReleased = true;
    }
}

class Pipe extends Component {
    constructor(moveSpeed) {
        super("pipe");
        this.moveSpeed = moveSpeed;
        this.wentThrough = false;
    }
}

class ScoreCounter extends Component {
    constructor() {
        super("scoreCounter");
        this.score = 0;
    }
}



// SYSTEMS
class ChickenSystem extends System {
    constructor() {
        super("chickenSystem");
        this.addRequirement("transform");
        this.addRequirement("boxCollider");
        this.addRequirement("rigidBody");
        this.addRequirement("chicken");
        this.addRequirement("soundEffect");
    }

    update(entity) {
        var transform = entity.getComponent("transform");
        var boxCollider = entity.getComponent("boxCollider");
        var rigidBody = entity.getComponent("rigidBody");
        var chicken = entity.getComponent("chicken");
        var soundEffect = entity.getComponent("soundEffect");

        if(!chicken.started)
            rigidBody.velocity.y = -rigidBody.gravity;

        if(isKeyDown(" ") || isMouseDown()) {
            if(chicken.flapReleased || !chicken.started) {
                rigidBody.velocity.y = chicken.flapHeight;
                chicken.flapReleased = false;
                chicken.started = true;
                soundEffect.play();
            }
        } else
            chicken.flapReleased = true;
        
        if(transform.position.y + rigidBody.velocity.y > getScreenHeight() - 36)
            init();

        var pipes = currentScene.findEntitiesWithTag("pipe");
        for(var i = 0; i < pipes.length; i++) {
            var pipe = pipes[i].getComponent("pipe");
            var colliders = pipes[i].getComponents("boxCollider");
            for(var j = 0; j < colliders.length; j++) {
                if(boxCollidersOverlap(transform, boxCollider, pipes[i].getComponent("transform"), colliders[j])) {
                    if(j == 2) {
                        if(!pipe.wentThrough) {
                            currentScene.findComponent("scoreCounter").score++;
                            pipe.wentThrough = true;
                            pipes[i].getComponent("soundEffect").play();
                        }
                    } else {
                        init();
                        return;
                    }
                }
            }
        }
    }
}

class PipeSystem extends System {
    constructor() {
        super("pipeSystem");
        this.addRequirement("transform");
        this.addRequirement("pipe");
        this.addRequirement("soundEffect");
    }

    update(entity) {
        var transform = entity.getComponent("transform");
        var pipe = entity.getComponent("pipe");
        var soundEffect = entity.getComponent("soundEffect");

        if(chicken.getComponent("chicken").started) transform.position.x -= pipe.moveSpeed;

        if(transform.position.x < -27) {
            transform.position.x = 306 + 120;
            pipe.wentThrough = false;
        }
    }
}

class ScoreCounterSystem extends System {
    constructor() {
        super("scoreCounterSystem");
        this.addRequirement("textRenderer");
        this.addRequirement("scoreCounter");
    }

    update(entity) {
        var textRenderer = entity.getComponent("textRenderer");
        var scoreCounter = entity.getComponent("scoreCounter");

        var stringText = scoreCounter.score.toString();
        if(stringText.toString().length == 1) stringText = "0000" + stringText;
        if(stringText.toString().length == 2) stringText = "000" + stringText;
        if(stringText.toString().length == 3) stringText = "00" + stringText;
        if(stringText.toString().length == 4) stringText = "0" + stringText;
        textRenderer.text = stringText;
    }
}



// VARIABLES
const SCREEN_SCALE_FACTOR = 4;

var startedGame = false;

var gameScene;
var background;
var chicken;
var blueberryjs;

function init() {
    if(!startedGame) {
        startedGame = true;
    } else {
        var startSound = new Audio();
        startSound.src = "sfx/lose.wav";
        startSound.play();
    }

    context.font = "16px squareFont";
    context.fillStyle = "#f1f7f9";

    gameScene = new Scene("scene");

    gameScene
        // UPDATE FUNCTIONS
        .addSystem(new RigidBodySystem())
        .addSystem(new ChickenSystem())
        .addSystem(new PipeSystem())
        .addSystem(new ScoreCounterSystem())

        // DRAW FUNCTIONS
        .addSystem(new ImageRendererSystem())
        .addSystem(new TextRendererSystem());

    background = gameScene.createEntity("background");
    background
        .addComponent(new Transform(new Vector2(0, getScreenHeight() - 176)))
        .addComponent(new ImageRenderer(createImage("img/background.png")))

        .addTag("background");
    
    chicken = gameScene.createEntity("chicken");
    chicken
        .addComponent(new Transform(new Vector2(getScreenWidth() / 2 - 40, getScreenHeight() / 2 - 26)))
        .addComponent(new BoxCollider(new Vector2(16, 13), Vector2.ZERO()))
        .addComponent(new RigidBody(0.16, 0))
        .addComponent(new Chicken(-2.8))
        .addComponent(new SoundEffect("sfx/flap.wav"))

        .addComponent(new ImageRenderer(createImage("img/chicken.png")))

        .addTag("chicken");

    for(var i = 0; i < 4; i++) {
        var pipe = gameScene.createEntity("pipe");
        pipe
            .addComponent(new Transform(new Vector2(306 + (i * 120), getScreenHeight() - randomRange(210, 265))))
            .addComponent(new Pipe(2))
            .addComponent(new SoundEffect("sfx/score.wav"))

            .addComponent(new BoxCollider(new Vector2(25, 119), new Vector2(1, 0)))
            .addComponent(new BoxCollider(new Vector2(25, 119), new Vector2(1, 161)))
            .addComponent(new BoxCollider(new Vector2(25, 42), new Vector2(1, 119)))

            .addComponent(new ImageRenderer(createImage("img/pipeSet.png")))

            .addTag("pipe");
    }

    blueberryjs = gameScene.createEntity("blueberryjs");
    blueberryjs
        .addComponent(new Transform(new Vector2(getScreenWidth() - 30, getScreenHeight() - 17)))
        .addComponent(new ImageRenderer(createImage("img/blueberryjs.png")))

        .addTag("blueberryjs");

    scoreCounter = gameScene.createEntity("scoreCounter");
    scoreCounter
        .addComponent(new Transform(new Vector2(getScreenWidth() / 2 - 25, 15)))
        .addComponent(new ScoreCounter())

        .addComponent(new TextRenderer("00000"))

        .addTag("scoreCounter");
    
    changeScene(gameScene);
}

function update() {
    updateScene();
}

function render() {
    renderScene();
}

start(SCREEN_SCALE_FACTOR);