import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from "../../assets/animation/Loading.json"; 

const LottieLoader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <Player
        autoplay
        loop
        src={loadingAnimation}
        style={{ height: "120px", width: "120px" }}
      />
    </div>
  );
};

export default LottieLoader;
