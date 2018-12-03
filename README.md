# solid-authing

`solid-authing` 集成了 [Solid](https://solid.inrupt.com) 和 [Authing](https://authing.cn) 的功能，登录/注册 Authing 等同于登录/注册 Solid。

`solid-authing` 使用 Authing 官方架设的 Solid Pod: [solid.authing.cn](https://solid.authing.cn)。

## 安装

``` shell
$ npm install solid-authing --save
```

## 使用

只能用于浏览器端，目前还处于 beta 版，可能会有不稳定，请暂时不要将此框架用于生产环境。

### 引入

``` javascript
import SolidAuthing from 'solid-authing';
```

### 注册

``` javascript
const main = async () => {
    const solidAuthing = new SolidAuthing({
        clientId: 'client_id',
        secret: 'client_secret',
    });

    const sa = await solidAuthing.getAuthingInsatance(); //必须调用

    const userInfo = await sa.register();
}
main();
```

### 登录

``` javascript
const main = async () => {
    const solidAuthing = new SolidAuthing({
        clientId: 'client_id',
        secret: 'client_secret',
    });

    const sa = await solidAuthing.getAuthingInsatance(); //必须调用

    const userInfo = await sa.login();
}
main();
```

### 退出

``` javascript
const main = async () => {
    const solidAuthing = new SolidAuthing({
        clientId: 'client_id',
        secret: 'client_secret',
    });

    const sa = await solidAuthing.getAuthingInsatance(); //必须调用

    const userInfo = await sa.logout();
}
main();
```

### 获取 Solid 实例

调用完 `getAuthingInsatance` 后可以使用 `solid`。

``` javascript
const main = async () => {
    const solidAuthing = new SolidAuthing({
        clientId: 'client_id',
        secret: 'client_secret',
    });

    const sa = await solidAuthing.getAuthingInsatance(); //必须调用

    // sa.solid...

    sa.solid.fetch('https://leinue.solid.authing.cn/public/test.html')
    .then((response) => {
        return response.text();
    })
    .then((data) => {
        // 打出 test.html 的网页内容
        console.log(data);
    });
}
main();
```
