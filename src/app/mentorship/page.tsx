import { Hero, Section, Card, TextLink } from "@/components/page-elements";
import { Icon } from "@/components/icons";
import { MentorshipStories } from "@/components/mentorship-stories";
import { MentorshipStoryAdmin } from "@/components/mentorship-story-admin";

export default function MentorshipPage() {
  return <div id="mentorship-page">
    <Hero
      eyebrow="Mentorship"
      title="A good conversation can change the shape of a week."
      action="See programmes"
      href="/programmes"
      backgroundImage="/background2.jpeg"
      hideDecoration
      overlay
      className="mentorship-hero"
      titleClassName="mentorship-gradient-title"
    >
      <p className="text-white/90">Mentorship at Nexus is about being heard, trying out ideas, and learning through honest conversation. There is no single script for what comes next.</p>
    </Hero>

    <Section eyebrow="Recent updates" title="Stories from the Nexus community." className="mentorship-section mentorship-stories-section">
      <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">Small moments, shared ideas, and fresh perspectives from our community.</p>
      <div className="mt-8"><MentorshipStories /></div>
      <MentorshipStoryAdmin />
    </Section>

    <Section eyebrow="What it can look like" title="Support that starts where you are." className="mentorship-section bg-white">
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Card icon={<Icon>1</Icon>} title="Make space">Bring a question, a goal, or something you are still finding words for.</Card>
        <Card icon={<Icon>2</Icon>} title="Think together">Reflect on options, experiences, and what feels meaningful to you.</Card>
        <Card icon={<Icon>3</Icon>} title="Choose a next step">Leave with something practical to try, explore, or return to later.</Card>
      </div>
    </Section>

    <Section tone="blue" eyebrow="For mentors" title="Share your experience with care and curiosity." className="mentorship-section mentorship-mentor-section">
      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">Being a mentor is less about having perfect answers and more about being present, asking thoughtful questions, and respecting a young person’s perspective.</p>
      <TextLink href="/contact" className="text-white">Ask about getting involved</TextLink>
    </Section>
  </div>;
}
