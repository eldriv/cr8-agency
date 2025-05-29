import { FaFacebook, FaTwitter, FaYoutube, FaExternalLinkAlt } from "react-icons/fa";

const footerLinks = [
  {
    title: "Facebook",
    href: "https://discord.com",
    icon: <FaFacebook />,
  },
  {
    title: "YouTube",
    href: "https://youtube.com",
    icon: <FaYoutube />,
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      <div className="w-full max-w-[1600px] mx-auto px-4">
        <div className="border-t border-white/15 py-6 text-sm flex flex-col md:flex-row md:justify-between items-center gap-8">
          <div className="text-white/40">
            &copy; 2025. All rights reserved. | Powered by CR8
          </div>
          <nav className="flex flex-col md:flex-row items-center gap-8">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
              >
                {link.icon}
                <span className="font-semibold">{link.title}</span>
                <FaExternalLinkAlt className="size-4" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
