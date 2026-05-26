import { FaFacebook, FaYoutube, FaExternalLinkAlt } from "react-icons/fa";

const footerLinks = [
  { title: "Facebook", href: "https://discord.com", icon: <FaFacebook /> },
  { title: "YouTube", href: "https://youtube.com", icon: <FaYoutube /> },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/img/logo.png" alt="CR8" className="h-8 w-8 object-contain" />
          <div>
            <p className="font-display text-sm font-semibold text-white">CR8 Agency</p>
            <p className="text-sm text-white/45">Creative studio for design, motion, and digital.</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white/75"
            >
              {link.icon}
              <span>{link.title}</span>
              <FaExternalLinkAlt className="h-3 w-3" />
            </a>
          ))}
        </nav>

        <p className="text-sm text-white/40">&copy; 2025 CR8. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
