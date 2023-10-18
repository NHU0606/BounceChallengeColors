import { _decorator, Component, director, find, Node } from 'cc';
import GameClient from '@onechaintech/gamesdk-beta'
import { StoreAPI } from './StoreAPI';
import Constants from '../Data/Constants';
import { DataGame, DataUser } from '../DataUser';
const { ccclass, property } = _decorator;

@ccclass('GameCenterController')
export class GameCenterController extends Component {
    private readonly gameIDDev: string = '64ec0c6dd122c633d3fd8ee6';
    private readonly apiKeyDev: string = '75667219-ec47-44dd-9425-ff507aacc3b3';
    private gameClient;

    public initGameClient(callBack: () => void): void {
        let parameters = new Node(Constants.NODE_NAME.GameClient);

        this.gameClient = new GameClient(this.gameIDDev, this.apiKeyDev, window.parent, { dev: true });
        this.gameClient.initAsync().then(async () => {
            //Get current user id
            let userID = this.gameClient.user.citizen.getCitizenId();

            //Get gamedata from server
           await this.gameClient.user.data.getGameData().then((response) => {
                //Save data
                if (response.data[`${userID}`] !== undefined) DataUser.dataUser = response.data[`${userID}`];
            }).catch((e) => {
                console.log('Error at get game data: ', e);
            })
            
            let gameClientParams = parameters.addComponent(StoreAPI);
            gameClientParams.gameClient = this.gameClient;
            director.addPersistRootNode(parameters);

            //Run callback
            callBack.apply(callBack);

          
        }).catch((e) => {
            console.log('Error at init game client: ', e);
        })
    }

    public startMatch(callBack: () => void): void {
        let parameters = find(Constants.NODE_NAME.GameClient);
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;

        this.gameClient.match.startMatch().then((data) => {
            gameClientParams.matchData = data;

            // Apply callback
            callBack.apply(callBack);
        }).catch((error) => console.log('Error at start match: ', error));
    }

    /** 
     * @param callBack Call when api done
     * @param data Data leader board
     */
    public completeMatch(callBack: () => void, data: Object): void {
        let parameters = find(Constants.NODE_NAME.GameClient);
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        
        this.gameClient.match.completeMatch(gameClientParams.matchData, data)
            .then(() => {
                let userID = this.gameClient.user.citizen.getCitizenId();
                this.gameClient.user.data.setGameData({ [userID]: DataUser.dataUser }, false).then(() => { })
                    .catch((e) => { console.log("Error at set game data", e); })

                //Apply callback
                callBack.apply(callBack);
            }).catch((e) => {
                console.log(e);
            })
    }
}
