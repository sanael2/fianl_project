let bg, titleImg, textImg, guide1Img, cameraImg, guide2Img, successImg, cardImg, videoImg, webcamImg, screenImg, stopImg, strokeImg, popupImg;
let state = 0;
let nextButton, cameraButton, reButton, startButton, stopButton, uploadButton, saveButton;
let webcam; // 웹캠 비디오 변수
let poseNet;
let poses = [];
let capturedPoses = [];

function preload() {
  bg = loadImage('img/0_bckground.png'); // 배경 이미지 로드
  titleImg = loadImage('img/0_title.png'); // 타이틀 이미지 로드
  textImg = loadImage('img/0_text.png'); // 텍스트 이미지 로드
  guide1Img = loadImage('img/1_guide.png'); // 두 번째 페이지 가이드 이미지 로드
  cameraImg = loadImage('img/1_camera.png'); // 카메라 이미지 로드
  videoImg = loadImage('img/1_video.png'); // 비디오 이미지 로드
  strokeImg = loadImage('img/1_stroke.png'); // '1_stroke.png' 이미지 로드
  guide2Img = loadImage('img/2_guide.png'); // 세 번째 페이지 가이드 이미지 로드
  screenImg = loadImage('img/3_screen.png'); // 네 번째 페이지 캔버스 이미지 로드
  stopImg = loadImage('img/3_stop.png'); // 네 번째 페이지 버튼 이미지 로드
  popupImg = loadImage('img/3_popup.png'); // 네 번째 페이지 팝업 이미지 로드
  cardImg = loadImage('img/4_card.png'); // 카드 이미지 로드
  successImg = loadImage('img/4_success.png'); // 성공 이미지 로드
}

function setup() {
  createCanvas(2000, 1126);
  webcam = createCapture(VIDEO); // 웹캠 비디오 캡처
  webcam.size(1410, 644); // 웹캠 비디오 크기 설정
  webcam.hide(); // 웹캠 비디오 요소 숨기기 (draw 함수에서 직접 그림)
  
  // 클릭 이벤트 리스너 추가 
  canvas = createCanvas(2000, 1126); 
  canvas.mouseClicked(toggleFullscreen);
}

function draw() {
  image(bg, 0, 0, width, height); // 배경 이미지 설정

  // 기존 버튼 제거
  if (nextButton) nextButton.remove();
  if (cameraButton) cameraButton.remove();
  if (reButton) reButton.remove();
  if (startButton) startButton.remove();
  if (stopButton) stopButton.remove();
  if (uploadButton) uploadButton.remove();
  if (saveButton) saveButton.remove();

  switch(state) {
    case 0:
      drawFirstPage();
      break;
    case 1:
      drawSecondPage();
      break;
    case 2:
      drawThirdPage();
      break;
    case 3:
      drawFourthPage();
      break;
    case 4:
      drawFifthPage();
      break;
  }
}

function drawFirstPage() {
  image(titleImg, 440, 80, 313, 41); // 타이틀 이미지
  image(textImg, 440, 204, 1078, 830); // 텍스트 이미지
  nextButton = createImg('img/0_next.png', 'Next');
  nextButton.position(1618, 964);
  nextButton.size(285, 66);
  nextButton.mousePressed(() => state = 1);
}

function drawSecondPage() {
  image(titleImg, 440, 80, 313, 41); // 타이틀 이미지
  image(videoImg, 490, 322, 1410, 644); // 비디오 이미지
  image(guide1Img, 380, 150, 1700, 150); // 가이드 이미지
  image(webcam, 490, 322, 1410, 644); // 웹캠 비디오 출력 (비디오 이미지 크기 및 위치로 설정)
  cameraButton = createImg('img/1_camera.png', 'Camera'); // 카메라 이미지
  cameraButton.position(1165, 1001);
  cameraButton.size(80, 80);
  cameraButton.mousePressed(captureWebcamImage); // 웹캠 이미지 캡처 함수 호출

  if (!poseNet) {
    poseNet = ml5.poseNet(webcam, modelReady); // PoseNet 모델 로드
    poseNet.on('pose', gotPoses); // PoseNet 결과 처리 함수 설정
  }

  // 모든 포즈의 스켈레톤 그리기
  if (poses.length > 0) {
    drawSkeleton();
  }

  // 맨 위 레이어에 '1_stroke.png' 이미지 추가
  image(strokeImg, 480, 310, 1440, 680);
}

function modelReady() {
  console.log('PoseNet 모델이 로드되었습니다.');
}

function gotPoses(results) {
  poses = results; // PoseNet 결과 저장
}

function drawSkeleton() {
  // 모든 포즈의 스켈레톤 그리기
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];

      stroke(249, 76, 97, 100);
      strokeWeight(30); // 선의 두께를 5배 더 굵게 설정
      line(partA.position.x + 490, partA.position.y + 322, partB.position.x + 490, partB.position.y + 322); // 좌표를 웹캠 위치로 이동
    }
  }
}

function drawCapturedSkeleton() {
  // 모든 포즈의 스켈레톤 그리기
  for (let i = 0; i < capturedPoses.length; i++) {
    let skeleton = capturedPoses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];

      stroke(249, 76, 97, 100);
      strokeWeight(30); // 선의 두께를 5배 더 굵게 설정
      line(partA.position.x + 490, partA.position.y + 322, partB.position.x + 490, partB.position.y + 322); // 좌표를 웹캠 위치로 이동
    }
  }
}

function isInBounds(position) { 
  return position.x >= 490 && position.x <= 1900 && position.y >= 322 && position.y <= 966;
}

function drawThirdPage() {
  image(titleImg, 440, 80, 313, 41); // 타이틀 이미지
  if (webcamImg) {
    image(webcamImg, 490, 322, 1410, 644); // 웹캠 이미지 출력
    drawCapturedSkeleton();
  } else {
    image(videoImg, 490, 322, 1410, 644); // 기본 비디오 이미지 출력
  }
  image(guide2Img, 380, 150, 1700, 150); // 세 번째 페이지 가이드 이미지
  reButton = createImg('img/2_re.png', 'Retry'); // 재시작 버튼
  reButton.position(900, 1006);
  reButton.size(285, 80); // 수정된 사이즈
  reButton.mousePressed(resetToSecondPage); // 두 번째 페이지로 돌아가면서 데이터 초기화
  startButton = createImg('img/2_start.png', 'Start'); // 시작 버튼
  startButton.position(1205, 1006);
  startButton.size(285, 80); // 수정된 사이즈
  startButton.mousePressed(() => state = 3); // 네 번째 페이지로 이동

  // 맨 위 레이어에 '1_stroke.png' 이미지 추가 
  image(strokeImg, 480, 310, 1440, 680);
}

function drawFourthPage() {
  image(screenImg, 0, 0, 2000, 1126); // 네 번째 페이지 캔버스 이미지
  checkPoseDeviation(); // 포즈 위치 비교 함수 호출
  stopButton = createImg('img/3_stop.png', 'Stop'); // 정지 버튼
  stopButton.position(50, 950);
  stopButton.size(150, 60);
  stopButton.mousePressed(() => state = 4); // 다섯 번째 페이지로 이동
}

function drawFifthPage() {
  image(successImg, 1000, 180, 389, 54); // 성공 이미지
  image(cardImg, 500, 200, 1400, 700); // 카드 이미지
  uploadButton = createImg('img/4_upload.png', 'Upload');
  uploadButton.position(840, 837);
  uploadButton.size(390, 108);
  // uploadButton.mousePressed(() => ...); // 업로드 기능 추가 필요
  saveButton = createImg('img/4_save.png', 'Save');
  saveButton.position(1268, 837);
  saveButton.size(323, 108);
  saveButton.mousePressed(saveCardImage); // 카드 이미지 저장 함수 호출
}

function captureWebcamImage() {
  webcamImg = webcam.get(); // 웹캠 이미지 캡처
  capturedPoses = poses.map(p => ({...p})); // 포즈 데이터 복사하여 저장
  webcam.hide(); // 웹캠 비디오 숨기기
  state = 2; // 세 번째 페이지로 이동
}

function resetToSecondPage() {
  webcamImg = null; // 저장된 웹캠 이미지 데이터 초기화
  webcam = createCapture(VIDEO); // 웹캠 다시 생성 및 활성화
  webcam.size(1410, 644); // 웹캠 비디오 크기 설정
  webcam.hide(); // 웹캠 비디오 요소 숨기기
  state = 1; // 두 번째 페이지로 이동
}

function saveCardImage() {
  let cardCanvas = createGraphics(1400, 700); // '4_card.png' 이미지를 위한 캔버스 생성
  cardCanvas.image(cardImg, 0, 0, 1400, 700); // '4_card.png' 이미지 추가
  save(cardCanvas, 'routine_card.png'); // 캔버스를 이미지 파일로 저장
}

function toggleFullscreen() { 
  let fs = fullscreen(); 
  fullscreen(true);
}

function keyPressed() {
  if (keyCode === ESCAPE) { // ESC 키를 눌렀을 때
    fullscreen(false); // 전체 화면 해제
  }
}

function checkPoseDeviation() {
  if (poses.length > 0 && capturedPoses.length > 0) {
    let exceedsThreshold = false;

    for (let i = 0; i < poses.length && i < capturedPoses.length; i++) {
      let pose = poses[i].pose;
      let capturedPose = capturedPoses[i].pose;

      for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
        let capturedKeypoint = capturedPose.keypoints[j];

        let dx = keypoint.position.x - capturedKeypoint.position.x;
        let dy = keypoint.position.y - capturedKeypoint.position.y;
        let distance = sqrt(dx * dx + dy * dy);

        if (distance > 400) { // 400px 이상의 차이가 있을 경우
          exceedsThreshold = true;
          break;
        }
      }

      if (exceedsThreshold) {
        image(popupImg, 1300, 950, 700, 112); // 팝업 이미지 표시
        break;
      }
    }
  }
}
