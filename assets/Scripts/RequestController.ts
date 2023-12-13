import { _decorator, Collider2D, IPhysics2DContact, Contact2DType, Component, Node, Prefab, Vec3, math, instantiate, Sprite, director, find } from 'cc';
const { ccclass, property } = _decorator;

const ENDPOINT = 'http://localhost:3000/v1';
@ccclass('RequestController')
export class RequestController extends Component {
  
  async post_without_header(params, url) {
    let resData;
    try {
      const res = await fetch( ENDPOINT + url,
        {
          method: 'POST',
          body: params
        }
      );
      resData = await res.json();
    } catch (err) {
      console.log(err.message);
    }
    return resData;
  }

  async post(params, url: any) {
    let token = JSON.parse(localStorage.getItem('token')) || undefined;
    let resData;
    try {
      const res = await fetch( ENDPOINT + url,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Accept: "text/vnd.turbo-stream.html",
          },
          body: params
        }
      );
      resData = await res.json();
    } catch (err) {
      console.log(err.message);
    }
    return resData;
  }

  async get(url: any) {
    let token = JSON.parse(localStorage.getItem('token')) || undefined;
    let resData;
    try {
      const res = await fetch( ENDPOINT + url,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              // Accept: "text/vnd.turbo-stream.html",
            },
          }
      );
      resData = await res.json();
    } catch (err) {
      console.log(err.message);
    }
    return resData;
  }
}
