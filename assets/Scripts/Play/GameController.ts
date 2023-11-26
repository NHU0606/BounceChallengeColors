import { StoreAPI } from "../GameCenter/StoreAPI";
import {
  _decorator,
  Animation,
  Collider2D,
  Color,
  Component,
  Contact2DType,
  director,
  find,
  Input,
  input,
  instantiate,
  IPhysics2DContact,
  Label,
  Node,
  Prefab,
  Sprite,
  Tween,
  tween,
  UITransform,
  Vec3,
} from "cc";
import { Score } from "../Score";
import { Property } from "../Property";
import { BallController } from "./BallController";
import { GameCenterController } from "../GameCenter/GameCenterController";
import { AudioController } from "../AudioController";
import { GameView } from "../GameView";
import { ShopValue } from "../ShopValue";
import Constants from "../Data/Constants";
import { DataUser } from "../DataUser";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: GameCenterController })
  private gameCenter: GameCenterController;

  @property({ type: Label })
  private highScore: Label;

  @property({ type: Label })
  private urScore: Label;

  @property({ type: Property })
  private property: Property;

  @property({ type: AudioController })
  private audioControl: AudioController;

  @property({ type: GameView })
  private gameView: GameView;

  @property({ type: Score })
  private score: Score;

  private countObstacle: number = 0;
  private ball: BallController;
  private shop: number = 0;

  private animContain: Animation | null = null;
  private animStar: Animation | null = null;
  private laneObstacle: boolean[][] = [];
  private createdObstacleCount: number = 0;
  private obstacleColor: Color = new Color(131, 180, 255);
  private countTouch: number = 0;
  private starPointCount: number = 0;
  private boomCount: number = 0;
  private heartCount: number = 0;
  private boosterCloseCount: number = 0;
  private boosterOpenCount: number = 0;
  private boomColorCount: number = 0;
  private intervalChecklog;
  private timeCheckLog: number = 0;
  private touchWal: boolean = false;

  protected onLoad(): void {
    this.intervalChecklog = setInterval(() => {
      this.timeCheckLog++;
    }, 1000)

    if (find("Shop") != null) {
      this.shop = find("Shop").getComponent(ShopValue).StoreModel;
      if (this.shop === undefined) this.shop = 0;
    }
    this.property.BallSprite.spriteFrame = this.property.BallSpriteFrame[this.shop];
  }

  protected start(): void {
    this.gameCenter.startMatch(() => {
      this.property.GameNodeFake.active = true;
      this.property.GameNode.active = true;

      this.schedule(() => {
        this.randomizeAndMove();
      }, 3)

      this.animContain = this.property.AnimContain.getComponent(Animation);
      this.animStar = this.property.AnimTouchStar.getComponent(Animation);

      setTimeout(() => {
        this.gameView.startTopBottom();
      }, 3000);

      this.ball = this.property.BallNode.getComponent(BallController);

      let collider = this.ball.getComponent(Collider2D);
      if (collider) {
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      }

      for (let i = 0; i < 6; i++) {
        this.laneObstacle[i] = [];
      }
    })
  }

  protected update(dt: number): void {
    this.changeDirectionBall();
  }

  private getRandomFunction(): Function {
    const functions = [
      // this.moveCloseWallRightLeft,
      // this.moveCloseWallRight,
      // this.moveCloseWallLeft,
      this.moveCloseTopBot,
      this.moveCloseBot,
      this.moveCloseTop
    ];

    const randomIndex = Math.floor(Math.random() * functions.length);
    return functions[randomIndex];
  }

  private randomizeAndMove(): void {
    const randomFunction = this.getRandomFunction();

    setTimeout(() => {
      randomFunction.call(this);
      setTimeout(() => {
        this.moveTopDown(400, -400);
      }, 5000);
    }, 4000);
  }

  // tween move wall right + left

  private moveWall(positionLeft: number, positionRight: number): void {
    const tweenWall = (wall: Node, position: Vec3): Tween<Node> =>
      tween(wall)
        .call(() => (wall.active = true))
        .to(0.3, { position })
        .start();

    tweenWall(this.property?.LeftWall, new Vec3(positionLeft, 0, 0));
    tweenWall(this.property?.RightWall, new Vec3(positionRight, 0, 0));
  }

  private moveCloseWallRightLeft(): void {
    if (this.property?.LeftWall.position.x >= -50) return;
    if (this.property?.RightWall.position.x <= 50) return;

    this.moveWall(this.property?.LeftWall.position.x + 30, this.property?.RightWall.position.x - 30);
  }

  private moveFarWallRightLeft(): void {
    if (this.property?.LeftWall.position.x <= -270) return;
    if (this.property?.RightWall.position.x >= 270) return;

    this.moveWall(this.property?.LeftWall.position.x - 30, this.property?.RightWall.position.x + 30);
  }

  // private moveCloseWallRight(): void {
  //   this.moveWall(-270, 220);
  // }

  // private moveCloseWallLeft(): void {
  //   this.moveWall(-220, 270);
  // }

  // tween move wall top + right

  private moveTopDown(posTop: number, posBot: number): void {
    const tweenWall = (wall: Node, position: Vec3): Tween<Node> =>
      tween(wall)
        .call(() => (wall.active = true))
        .to(0.3, { position })
        .start();

    tweenWall(this.property?.BottomContain, new Vec3(0, posBot, 0))
    tweenWall(this.property?.TopContain, new Vec3(0, posTop, 0))
  }

  private moveCloseTopBot(): void {
    this.moveTopDown(380, -380);
  }

  private moveCloseTop(): void {
    this.moveTopDown(380, -400);
  }

  private moveCloseBot(): void {
    this.moveTopDown(400, -380);
  }

  private onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null,
    score: number
  ): void {
    const otherTag = otherCollider.tag;
    if (otherTag === 12) {
      this.countTouch++;
      this.touchWal = true;
      this.audioControl.onAudioArray(4);
      this.animContain.play("BallBounce");
      this.property.BallControl.touchRightWall();
      this.property.AnimContain.setPosition(
        this.property.BallNode.position.x,
        this.property.BallNode.position.y,
        0
      );
      this.createObstacle("left", this.countObstacle, this.obstacleColor);
      this.property.LeftContain.active = true;
      this.property.RightContain.active = false;
    } else if (otherTag === 11) {
      this.touchWal = true;
      this.countTouch++;
      this.property.BallControl.touchLeftWall();
      this.audioControl.onAudioArray(4);
      this.animContain.play("BallBounce");
      this.property.AnimContain.setPosition(
        this.property.BallNode.position.x,
        this.property.BallNode.position.y,
        0
      );
      this.createObstacle("right", this.countObstacle, this.obstacleColor);
      this.property.LeftContain.active = false;
      this.property.RightContain.active = true;
    }
    else if (otherTag === 1) {
      this.audioControl.onAudioArray(1);
      this.score.minus3Heart();
    } else if (otherTag === 3) {
      this.audioControl.onAudioArray(1);
      this.score.minusHeart();
      this.animContain.play("BallGameOver");
      this.property.AnimContain.setPosition(
        this.property.BallNode.position.x,
        this.property.BallNode.position.y,
        0
      );
    } else if (otherTag === 4) {
      this.audioControl.onAudioArray(3);
      this.score.addStar();
      this.animStar.play("TouchStar");
      this.property.AnimTouchStar.setPosition(
        this.property.BallNode.position.x,
        this.property.BallNode.position.y,
        0
      );

      let logGame = {
        seconds: this.timeCheckLog,
        score: this.score.currentScore,
        datetime: new Date().toLocaleString()
      };

      if (this.score.currentScore % 10 === 0) this.gameCenter.setGameData(logGame);


      const starts = this.property.StarPointContain.children;
      for (let i = 0; i < starts.length; i++) {
        if (starts[i] === otherCollider.node) {
          if (this.score.currentScore <= 80 && this.score.currentScore > 1) {
            starts[i].active = false;

            setTimeout(() => {
              setTimeout(() => {
                this.spawnStarPoint(1);
              }, 100)
              starts[i].active = true;
            }, 400);
          }

          if (this.score.currentScore > 80) {
            starts[i].active = false;
          }
        }
      }
    } else if (otherTag === 5) {
      this.audioControl.onAudioArray(1);
      this.score.minusHeart();
      this.animContain.play("BallGameOver");
      this.property.AnimContain.setPosition(
        this.property.BallNode.position.x,
        this.property.BallNode.position.y,
        0
      );

      const booms = this.property.BoomContain.children;
      for (let i = 0; i < booms.length; i++) {
        if (booms[i] === otherCollider.node) {
          booms[i].active = false;

          setTimeout(() => {
            setTimeout(() => {
              this.spawnBoom(1);
            }, 500);
            booms[i].active = true;
          }, 6500);
        }
      }
    } else if (otherTag === 6) {
      this.audioControl.onAudioArray(3);

      const newColor = this.gameView.getRandomColor();
      const leftLine = this.property.LeftLine.getComponent(Sprite);
      const leftFakeLine = this.property.LeftFakeLine.getComponent(Sprite);
      const rightLine = this.property.RightLine.getComponent(Sprite);
      const rightFakeLine = this.property.RightFakeLine.getComponent(Sprite);
      const topLine = this.property.TopContain.getComponent(Sprite);
      const bottomLine = this.property.BottomContain.getComponent(Sprite);
      if (
        leftLine ||
        rightLine ||
        topLine ||
        leftFakeLine ||
        rightFakeLine
      ) {
        leftLine.color = newColor;
        leftFakeLine.color = leftLine.color;
        rightLine.color = leftLine.color;
        rightFakeLine.color = leftLine.color;
        topLine.color = leftLine.color;
        bottomLine.color = leftLine.color;
      }

      const boomsColor = this.property.BoomColorContain.children;
      for (let i = 0; i < boomsColor.length; i++) {
        if (boomsColor[i] === otherCollider.node) {
          boomsColor[i].active = false;

          setTimeout(() => {
            setTimeout(() => {
              this.spawnBoomColor(1);
            }, 500)
            boomsColor[i].active = true;
          }, 6500);
        }
      }

      this.obstacleColor = leftLine.color;
      this.applyColorToObstacles(this.property.LeftContain, leftLine.color);
      this.applyColorToObstacles(this.property.RightContain, leftLine.color);
    } else if (otherTag === 10) {
      this.audioControl.onAudioArray(3);
      this.score.plusHeart();

      const hearts = this.property.HeartPrefabContain.children;
      for (let i = 0; i < hearts.length; i++) {
        if (hearts[i] === otherCollider.node) {
          hearts[i].active = false;

          setTimeout(() => {
            setTimeout(() => {
              this.spawnHeart(1);
            }, 500);
            hearts[i].active = true;
          }, 6000);
        }
      }
    } else if (otherTag === 14) {
      this.audioControl.onAudioArray(3);

      this.moveCloseWallRightLeft();
      const boosterClose = this.property.BoosterCloseContain.children;
      for (let i = 0; i < boosterClose.length; i++) {
        if (boosterClose[i] === otherCollider.node) {
          boosterClose[i].active = false;

          setTimeout(() => {
            // setTimeout(() => {
            // }, 2500);
            // boosterClose[i].active = true;
            this.spawnBoosterClose(1);
          }, 2000);
        }
      }
    } else if (otherTag === 15) {
      this.audioControl.onAudioArray(3);

      this.moveFarWallRightLeft();
      const boosterOpen = this.property.BoosterOpenContain.children;
      for (let i = 0; i < boosterOpen.length; i++) {
        if (boosterOpen[i] === otherCollider.node) {
          boosterOpen[i].active = false;

          setTimeout(() => {
            setTimeout(() => {
              this.spawnBoosterOpen(1);
            }, 500);
            boosterOpen[i].active = true;
          }, 2500);
        }
      }
    }

    if (this.score.heart <= 0) this.gameOver();
  }

  private applyColorToObstacles(container: Node, color: Color): void {
    const obstacleInstances = container.children;

    for (let i = 0; i < obstacleInstances.length; i++) {
      const obstacleInstance = obstacleInstances[i];
      const spriteObstacle = obstacleInstance.getComponent(Sprite);
      if (spriteObstacle) spriteObstacle.color = color;
    }
  }

  private createObstacle(
    side: "left" | "right",
    count: number,
    color: Color
  ): void {
    const container =
      side === "left" ? this.property.LeftContain : this.property.RightContain;
    const prefab =
      side === "left"
        ? this.property.ObstaclePrefabLeft
        : this.property.ObstaclePrefabRight;

    container.removeAllChildren();

    const selectedLaneIndices: number[] = [];
    let availableLaneIndices: number[] = [0, 1, 2, 3, 4, 5];

    while (
      selectedLaneIndices.length < count &&
      availableLaneIndices.length > 1
    ) {
      const randomIndex = Math.floor(
        Math.random() * availableLaneIndices.length
      );
      const laneIndex = availableLaneIndices[randomIndex];

      selectedLaneIndices.push(laneIndex);
      availableLaneIndices.splice(randomIndex, 1);
      this.createdObstacleCount++;
    }
    for (let i = 0; i < selectedLaneIndices.length; i++) {
      const laneIndex = selectedLaneIndices[i];
      this.laneObstacle[laneIndex].push(true);

      const obstacleInstance = instantiate(prefab);
      const spriteObstacle = obstacleInstance.getComponent(Sprite);

      if (spriteObstacle) {
        spriteObstacle.color = color;
      }

      const laneHeight = container.height / 6;
      const obstaclePosY = laneIndex * laneHeight;

      obstacleInstance.active = false;
      const startPos = new Vec3(side === "left" ? -300 : 300, obstaclePosY, 0);
      const endPos = new Vec3(side === "left" ? 30 : -30, obstaclePosY, 0);

      tween(obstacleInstance)
        .call(() => (obstacleInstance.active = true))
        .to(0.3, { position: endPos })
        .start();

      obstacleInstance.setPosition(startPos.add(new Vec3(i * 20, 0, 0)));
      container.addChild(obstacleInstance);
    }
  }

  private changeDirectionBall(): void {
    if (this.countObstacle <= 5) this.countObstacle = this.score.currentScore / 15 + 1;
    if (this.score.currentScore < 15) this.countObstacle = 2;

    if (
      this.score.currentScore > 1 &&
      this.starPointCount < 2 &&
      this.score.currentScore % 2 === 0
    ) {
      this.spawnStarPoint(1);
      this.spawnStarPoint(1);
    }

    if (
      this.score.currentScore > 1 &&
      this.boomCount < 2 &&
      this.countTouch % 6 === 0
    ) {
      this.spawnBoom(1);
      this.spawnBoom(1);
    }

    if (
      this.score.currentScore > 1 &&
      this.boomColorCount < 2 &&
      this.countTouch % 5 === 0
    ) {
      this.spawnBoomColor(1);
    }

    if (
      this.score.currentScore > 1 &&
      this.heartCount < 2 &&
      this.countTouch % 6 === 0
    ) {
      this.spawnHeart(1);
      this.spawnHeart(1);
    }

    if (
      this.score.currentScore > 1 &&
      this.boosterCloseCount < 2 &&
      this.countTouch % 3 === 0
    ) {
      this.spawnBoosterClose(1);
      this.spawnBoosterClose(1);
    }

    if (
      this.score.currentScore > 1 &&
      this.boosterOpenCount < 2 &&
      this.countTouch % 6 === 0
    ) {
      this.spawnBoosterOpen(1);
      this.spawnBoosterOpen(1);
    }

    this.property.StarPointContain.active = this.score.currentScore % 2 === 0;
    this.property.BoomContain.active = this.countTouch % 6 === 0;
    this.property.BoomColorContain.active = this.countTouch % 5 === 0;
    this.property.HeartPrefabContain.active = this.countTouch % 6 === 0;
    this.property.BoosterCloseContain.active = this.countTouch % 3 === 0;
    this.property.BoosterOpenContain.active = this.countTouch % 6 === 0;
  }

  //------ spawn prefab--------------

  private spawnHeart(count: number): void {
    const heartPrefab = this.property.HeartPrefab;
    const heartContain = this.property.HeartPrefabContain;

    heartContain.removeAllChildren();
    this.heartCount += this.spawnPrefab(heartPrefab, heartContain, count);
  }

  private spawnBoosterClose(count: number): void {
    const closePrefab = this.property.BoosterClosePrefab;
    const closePrefabContain = this.property.BoosterCloseContain;

    closePrefabContain.removeAllChildren();

    const randomCount = Math.floor(Math.random() * 2) + 1;

    this.boosterCloseCount += randomCount;
    this.spawnPrefab(closePrefab, closePrefabContain, randomCount);
  }


  private spawnBoosterOpen(count: number): void {
    const openPrefab = this.property.BoosterOpenPrefab;
    const openPrefabContain = this.property.BoosterOpenContain;

    openPrefabContain.removeAllChildren();
    this.boosterOpenCount += this.spawnPrefab(openPrefab, openPrefabContain, count);
  }

  private spawnPrefab(prefab: Prefab, container: Node, count: number) {
    container.removeAllChildren();

    for (let i = 0; i < count; i++) {
      const objectInstance = instantiate(prefab);

      const maxX = container.width / 2;
      const maxY = container.height / 2;
      const randomX = Math.random() * (maxX * 2) - maxX;
      const randomY = Math.random() * (maxY * 2) - maxY;

      objectInstance.setPosition(randomX, randomY, 0);
      container.addChild(objectInstance);
      objectInstance.active = true;
    }
    return count;
  }

  public spawnStarPoint(count: number): void {
    const starPrefab = this.property.StarPoint;
    const starContain = this.property.StarPointContain;

    starContain.removeAllChildren();
    this.starPointCount += this.spawnPrefab(starPrefab, starContain, count);
  }

  public spawnBoom(count: number): void {
    const boomPrefab = this.property.BoomPrefab;
    const boomContain = this.property.BoomContain;

    boomContain.removeAllChildren();
    this.boomCount += this.spawnPrefab(boomPrefab, boomContain, count);
  }

  public spawnBoomColor(count: number): void {
    const boomColorPrefab = this.property.BoomColorPrefab;
    const boomColorContain = this.property.BoomColorContain;

    boomColorContain.removeAllChildren();
    this.boomColorCount += this.spawnPrefab(boomColorPrefab, boomColorContain, count);
  }

  private onClickReplay(): void {
    this.audioControl.onAudioArray(5);
    this.gameView.interactableBtnPause();

    director.loadScene(Constants.SCENE_NAME.Play);
  }

  private gameOver(): void {
    this.gameCenter.completeMatch(() => {
    }, { score: this.score.getScore() });

    input.off(Input.EventType.TOUCH_START);
    this.property.AnimContain.active = false;
    this.property.AnimTouchStar.active = false;
    this.property.LeftContain.active = false;
    this.property.RightContain.active = false;
    this.gameView.overTopBottom();
    this.property.GameNode.active = false;
    this.property.PauseContain.active = false;
    this.property.NontifiOver.active = true;
    this.property.BallNode.position = new Vec3(0, 50, 0);

    this.gameView.updateStars();
    setTimeout(() => {
      this.property.ShopBtn.node.active = true;
      this.property.ContainImgSoundContain.active = true;
      this.property.GameNodeFake.active = false;
      this.property.NontifiOver.active = false;
      this.property.OverNode.active = true;
      this.showScoreResult();
    }, 2000);
  }

  private showScoreResult(): void {
    DataUser.dataUser.data.cost += this.score.currentScore;

    this.urScore.string = this.score.currentScore.toString();
    this.highScore.string = DataUser.dataUser.data.highscore.toString();
  }
}
