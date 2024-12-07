# vscode에서 세팅
## WSL과 연결
ctrl+shift+p, WSL:Connect to WSL

## WSL에서 필요 패키지 설치
```sudo apt update```
```sudo apt install git -y```
```sudo apt install nodejs npm -y```
```sudo apt install build-essential -y```


# 깃 레포 연결
## 1. 클론
```git clone https://github.com/CBNU-MoaNote-CapstonDesign/front-demo2.git```
```cd front-demo2```


## 2. 의존 패키지 설치
`npm install`

## 3. 실행
`npm start`

[http://localhost:3000](http://localhost:3000) 에 서페이지 실행됨


# 트러블 슈팅
## UNC 경로 문제
nvm lts 최신 버전으로 재설치

https://stackoverflow.com/questions/74000168/running-an-express-server-from-wsl-unc-paths-are-not-supported

```curl https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

source ~/.bashrc

nvm install --lts```


# React App 소개 및 실행 메뉴얼

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


### 자동생성 API 연결
자동생성은 로컬 환경의 프록시 서버가 api 호출을 중계합니다. 프록시 서버는 3002 포트에서 열립니다. 아래에는 python flask로 구현된 간단한 프록시 서버의 코드가 있습니다. 프록시 서버에는 api 키가 필요하며, openai project에 가입한 후 발급받을 수 있습니다. 또한, openai project billing에서 크레딧을 결제해야 openai의 api 이용이 가능합니다.


## 파이썬 플라스크 설치

```bash
pip install 
```


## openai gpt api 프록시 서버
`proxy.py`
```python
# OpenAI API 키
OPENAI_API_KEY = "여기에 키 입력"

from flask import Flask, request, jsonify
import requests

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# OpenAI API URL
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

@app.route('/proxy', methods=['POST'])
def proxy():
    try:
        print("중계 요청 처리중...")
        data = request.get_json()

        payload = {
            "model": data.get("model", "gpt-4"),  # 기본값은 gpt-4
            "messages": data["messages"],        
            "temperature": data.get("temperature", 0.7),  # 기본값은 0.7
        }

        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        }

        response = requests.post(OPENAI_API_URL, headers=headers, json=payload)

        if response.status_code == 200:
            response_data = response.json()
            print("Prompt 처리 완료:", response_data)
            return jsonify(response_data)
        else:
            error_message = {
                "error": f"OpenAI API Error: {response.status_code}",
                "details": response.text,
            }
            print("OpenAI API 에러:", error_message)
            return jsonify(error_message), response.status_code

    except Exception as e:
        error_message = {"error": "Server Error", "details": str(e)}
        print("서버 에러:", error_message)
        return jsonify(error_message), 500

if __name__ == '__main__':
    app.run(port=3002, debug=True)

```

## 프록시 서버 실행
```bash
python proxy.py
```