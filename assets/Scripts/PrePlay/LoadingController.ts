import { _decorator, Component, director, find, Node } from 'cc';
import GameClient from '@onechaintech/gamesdk-dev';
import { StoreAPI } from '../StoreAPI';
import { DataUser, SCENE_NAME } from '../Data';
const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {
    private readonly gameId: string = '64ec0c6dd122c633d3fd8ee6';
    private readonly apikey: string = '75667219-ec47-44dd-9425-ff507aacc3b3';

    public gameClient;
    private userId: string;

    protected async onLoad(): Promise<void> {
        let parameters = find('GameClient');
        
        if ( parameters === null ) {
            let parameters = new Node('GameClient');
            if ( this.gameClient === undefined ) {
                this.gameClient = new GameClient( this.gameId, this.apikey, window.parent, {dev: true});
                await this.gameClient.initAsync()
                .then(async(data) => {
                    let userID = this.gameClient.user.citizen.getCitizenId();
                    
                    //Get gamedata from server
                    await this.gameClient.user.data.getGameData().then((response) => {
                        //Save data
                        if (response.data[`${userID}`] !== undefined){
                            DataUser.dataUser = response.data[`${userID}`];
                        }    
                    })
                    .catch(async (e) => {
                        console.log('Error at get game data: ', e);
                    })
                    
                    let gameClientParams = parameters.addComponent(StoreAPI);
                    gameClientParams.gameClient = this.gameClient;
                    director.addPersistRootNode(parameters);

                    director.loadScene(SCENE_NAME.Entry);
                })
                .catch((err) => console.log(err));
            }
        }
    }
}

