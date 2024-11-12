import { LottieOptions, useLottie } from 'lottie-react';
import { useInView } from 'framer-motion';
import { useEffect, memo } from 'react';

const LazyGiftLottie = ({
  animationData,
  onLoad,
  ...props
}: LottieOptions<'svg' | 'canvas'> & { onLoad?: () => void }) => {
  const { View, animationContainerRef, goToAndPlay, animationLoaded } = useLottie({
    animationData,
    loop: false,
    autoPlay: false,
    ...props,
  });
  const isVisible = useInView(animationContainerRef, { margin: '0px 50px -100px 0px' });

  useEffect(() => {
    if (isVisible) {
      goToAndPlay(0);
    }
  }, [isVisible, goToAndPlay]);

  useEffect(() => {
    if (animationLoaded && onLoad) {
      onLoad();
    }
  }, [animationLoaded, onLoad]);

  return View;
};

export default memo(LazyGiftLottie);
