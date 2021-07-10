// COMPONENTS
class PlayerController extends Component {
    constructor(moveSpeed, jumpHeight) {
        super("playerController");
        this.moveSpeed = moveSpeed;
        this.jumpHeight = jumpHeight;
        this.jumpReleased = true;
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

    update(entity) {
        var rigidBody = entity.getComponent("rigidBody");
        var playerController = entity.getComponent("playerController");
        var soundEffect = entity.getComponent("soundEffect");

        var input = 0;

        if(isKeyDown("a")) input = -1;
        if(isKeyDown("d")) input = 1;

        rigidBody.velocity.x += input * playerController.moveSpeed;

        if(isKeyDown("w")) {
            if(playerController.jumpReleased)
                rigidBody.velocity.y = playerController.jumpHeight;
            playerController.jumpReleased = false;
        } else
            playerController.jumpReleased = true;

        if(isKeyDown(" ")) {
            if(playerController.spaceReleased)
                soundEffect.play();
            playerController.spaceReleased = false;
        } else
            playerController.spaceReleased = true;
    }
}



// VARIABLES
const SCREEN_SCALE_FACTOR = 3;

var gameScene;
var map;
var player;

function init() {
    gameScene = new Scene("scene");

    gameScene
        // UPDATE FUNCTIONS
        .addSystem(new PlayerControllerSystem())
        .addSystem(new MapCollisionSystem())

        // DRAW FUNCTIONS
        .addSystem(new MapRendererSystem())
        .addSystem(new ImageRendererSystem());

    map = gameScene.createEntity("map");
    map
        .addComponent(new MapRenderer(createImage("img/tileset.png"), 16, [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0],
            [0, 0, 0, 0, 0, 7, 8, 8, 8, 9, 0, 0, 1, 2, 2, 2, 3, 0, 0, 0, 7, 8, 9, 0, 0, 0],
            [2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [5,10, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [5, 5,10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        ], [1, 2, 3, 4, 5, 6, 7, 8, 9]))

        .addTag("map");

    player = gameScene.createEntity("player");
    player
        .addComponent(new Transform(new Vector2(window.innerWidth / SCREEN_SCALE_FACTOR / 2 - 8, window.innerHeight / SCREEN_SCALE_FACTOR / 2 - 8)))
        .addComponent(new BoxCollider(new Vector2(12, 15), new Vector2(2, 1)))
        .addComponent(new RigidBody(0.35, new Vector2(0.2, 0.01)))
        .addComponent(new PlayerController(0.72, -6))
        .addComponent(new ImageRenderer(createImage("img/player.png")))
        .addComponent(new SoundEffect("sfx/baDing.wav"))
        
        .addTag("player")
        .addTag("collidesWithMap");
    
    changeScene(gameScene);
}

function update() {
    updateScene();
}

function render() {
    renderScene();
}

start(SCREEN_SCALE_FACTOR);