// COMPONENTS
class PlayerController extends Component {
    constructor(moveSpeed) {
        super("playerController");
        this.moveSpeed = moveSpeed;
        this.spaceReleased = true;
    }
}



// SYSTEMS
class PlayerControllerSystem extends System {
    constructor() {
        super("playerControllerSystem");
        this.addRequirement("rigidBody");
        this.addRequirement("playerController");
        this.addRequirement("soundEffect");
    }

    render(entity, context) {
        var rigidBody = entity.getComponent("rigidBody");
        var playerController = entity.getComponent("playerController");
        var soundEffect = entity.getComponent("soundEffect");

        var input = Vector2.ZERO();

        if(isKeyDown("w")) input.y = -1;
        if(isKeyDown("s")) input.y = 1;
        if(isKeyDown("a")) input.x = -1;
        if(isKeyDown("d")) input.x = 1;

        rigidBody.velocity = Vector2.add(rigidBody.velocity, Vector2.multiply(Vector2.normalize(input), playerController.moveSpeed));

        if(isKeyDown(" ")) {
            if(playerController.spaceReleased) {
                soundEffect.play();
                playerController.spaceReleased = false;
            }
        } else
            playerController.spaceReleased = true;
    }
}



// VARIABLES
const SCREEN_SCALE_FACTOR = 3;

var gameScene;
var player;
var testObject;

function init() {
    gameScene = new Scene("scene");

    gameScene
        // UPDATE FUNCTIONS
        .addSystem(new PlayerControllerSystem())
        .addSystem(new RigidBodySystem())

        // DRAW FUNCTIONS
        .addSystem(new ImageRendererSystem());

    player = gameScene.createEntity("player");

    player
        .addComponent(new Transform(new Vector2(window.innerWidth / scaleFactor / 2 - 8, window.innerHeight / scaleFactor / 2 - 8)))
        .addComponent(new BoxCollider(new Vector2(10, 17), new Vector2(0, 0)))
        .addComponent(new RigidBody(0, new Vector2(0.2, 0.2)))
        .addComponent(new PlayerController(0.72))
        .addComponent(new ImageRenderer(createImage("img/player.png")))
        .addComponent(new SoundEffect("sfx/baDing.wav"))
        
        .addTag("player");

    testObject = gameScene.createEntity("testObject");

    testObject
        .addComponent(new Transform(new Vector2(5, 5)))
        .addComponent(new BoxCollider(new Vector2(10, 17), new Vector2(0, 0)))
        .addComponent(new ImageRenderer(createImage("img/player.png")))

        .addTag("testObject");

    changeScene(gameScene);
}

function update() {
    updateScene();
}

function render() {
    renderScene();
    context.fillText("collides: " + boxCollidersOverlap(player.getComponent("transform"), player.getComponent("boxCollider"), testObject.getComponent("transform"), testObject.getComponent("boxCollider")), 1, 11);
}

start(SCREEN_SCALE_FACTOR);