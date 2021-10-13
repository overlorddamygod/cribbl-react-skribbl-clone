import React from "react";

type AvatarProps = {
  seed: string;
  sprites?: string;
  className?: string;
  alt: string;
};

const Avatar = ({
  seed = "lol",
  sprites = "bottts",
  className = "hover:scale-110 duration-75",
  alt,
}: AvatarProps) => {
  return (
    <img
      src={`https://avatars.dicebear.com/api/${sprites}/${seed}.svg`}
      className={className}
      alt={alt}
    />
  );
};

export default Avatar;
