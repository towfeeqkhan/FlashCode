import icon from "../assets/icon.png";

function Header() {

  return (
    <div className="absolute top-4 left-4 z-20">
      <div className="flex items-center gap-2">
        <img 
          src={icon} 
          alt="FlashCode Logo" 
          className="h-10 w-10" 
        />
      </div>
    </div>
  );
}

export default Header;
