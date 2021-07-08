// COMPONENTS
class PlayerController extends Component {
    constructor(moveSpeed) {
        super("playerController");
        this.moveSpeed = moveSpeed;
    }
}



// SYSTEMS
class PlayerControllerSystem extends System {
    constructor() {
        super("playerControllerSystem");
        this.addRequirement("transform");
        this.addRequirement("rigidBody");
        this.addRequirement("playerController");
    }

    render(entity, context) {
        var transform = entity.getComponent("transform");
        var rigidBody = entity.getComponent("rigidBody");
        var playerController = entity.getComponent("playerController");

        var input = Vector2.ZERO();

        if(isKeyDown("w")) input.y = -1;
        if(isKeyDown("s")) input.y = 1;
        if(isKeyDown("a")) input.x = -1;
        if(isKeyDown("d")) input.x = 1;

        rigidBody.velocity = Vector2.add(rigidBody.velocity, Vector2.multiply(Vector2.normalize(input), playerController.moveSpeed));
    }
}



// VARIABLES
var gameScene;
var player;
var block;

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
        .addComponent(new BoxCollider(new Vector2(10, 17)))
        .addComponent(new RigidBody(0, new Vector2(0.8, 0.8)))
        .addComponent(new PlayerController(0.72))
        .addComponent(new ImageRenderer(createImage("img/player.png")));

    block = gameScene.createEntity("block");

    block
        .addComponent(new Transform(new Vector2(5, 5)))
        .addComponent(new BoxCollider(new Vector2(10, 17)))
        .addComponent(new ImageRenderer(createImage("img/player.png")));

    changeScene(gameScene);
}

function render() {
    renderScene();
    context.fillText("collides: " + boxCollidersOverlap(player, block), 1, 11);
}

start(3);