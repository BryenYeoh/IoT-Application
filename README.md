# FatigueDetection App

To run:

1. `cd flask-app`
2. `python app.py`
   on another terminal,
3. `cd my-app && npm install`
4. `npm run dev`

to try access on phone:
`npm run dev -- --host`

to test on localhost for cv:
-- change relevant api calls in my-app/src/components/CV/Video.jsx into https://localhost:3500/${endpoint}
-- change cap = cv2.VideoCapture(ip_webcam_url) , int cap = cv2.VideoCapture(0) in flask-app/app.py
-- change app.run(host='172.20.10.2', port=3500, debug=True, ssl_context=context) into app.run(host='127.0.0.1', port=3500, debug=True, ssl_context=context) in flask-app/app.py


to test on mobile for cv:
-- connect to the same network between host machine and phone
-- retrieve ip address.
-- change app.run(host='172.20.10.2', port=3500, debug=True, ssl_context=context) into app.run(host='ip_addr', port=3500, debug=True, ssl_context=context) in flask-app/app.py
-- open ip web cam app, start server, note the ip web cam's ip addr
-- change ip_webcam_url = 'http://172.20.10.8:8080/video' into ip_webcam_url = 'http://${ip web cam ip_addr}:8080/video' in flask-app/app.py
-- replace next line cap=cv2.VideoCapture with cap = cv2.VideoCapture(ip_webcam_url) in flask-app/app.py
-- add ip address, including the port number 5713 into CORS(app, resources={r"/\*": {"origins": ["https://localhost:5173", "https://172.20.10.2:5173"]}}) in flask-app/app.py
--change relevant api calls in my-app/src/components/CV/Video.jsx into https://ipaddr:3500/${endpoint}
-- ensure you have loaded localhost-key.pem and localhost.pem under the flask-app directory.
-- when asked for pass phrase after running app.py, input "test". You will be prompted twice. 
