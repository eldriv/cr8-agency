import { useState } from "react";
import { Mail, MessageSquare, Send, User } from "lucide-react";
import { Reveal, SectionBackdrop, SectionLabel } from "./ui/Reveal";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xovdzpnj";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Field = ({ icon: Icon, label, error, children }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-white/80">{label}</label>
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
      {children}
    </div>
    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Enter a valid email";
    if (!formData.subject.trim()) nextErrors.subject = "Subject is required";
    if (!formData.message.trim()) nextErrors.message = "Message is required";
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
        }),
      });

      if (!response.ok) throw new Error("Failed to send");

      setIsSubmitted(true);
      setFormData(initialForm);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 focus:bg-white/[0.05]";

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/10 bg-black py-20 sm:py-28">
      <SectionBackdrop />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionLabel>Contact</SectionLabel>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Let&apos;s talk about your <span className="text-gradient">next project.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              Share your goals, timeline, and vision. We&apos;ll respond within 24 hours with next steps
              and how CR8 can help bring your idea to life.
            </p>

            <div className="mt-10 space-y-4">
              <div className="glass-panel rounded-2xl p-5">
                <p className="text-sm text-white/50">Response time</p>
                <p className="mt-1 font-medium text-white">Within 24 hours</p>
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <p className="text-sm text-white/50">Best for</p>
                <p className="mt-1 font-medium text-white">Brands, startups, and creative teams</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="glass-panel rounded-3xl p-6 sm:p-8">
            {isSubmitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-white">Message sent</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                  Thanks for reaching out. We&apos;ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" icon={User} error={errors.name}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email address" icon={Mail} error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Subject" icon={MessageSquare} error={errors.subject}>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry"
                    className={inputClass}
                  />
                </Field>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className={`${inputClass} resize-none pl-4`}
                  />
                  {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message}</p>}
                </div>

                {errors.submit && <p className="text-sm text-red-400">{errors.submit}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isLoading ? "Sending..." : "Send message"}
                  {!isLoading && <Send className="h-4 w-4" />}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
