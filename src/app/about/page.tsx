import { Hero, Section, Card } from "@/components/page-elements";
import { Icon } from "@/components/icons";
export default function AboutPage() { return <><Hero eyebrow="About Nexus" title="A shared space for figuring things out." action="Explore our programmes" href="/programmes"><p>Nexus RiseGen Alliance (NRA) is a youth-led movement dedicated to developing leaders, strengthening families, and transforming communities. We bring together students, professionals, and mentors to foster growth through leadership development, mentorship, innovation, health awareness, and active community engagement.</p>
<p>Empowered people. Stronger communities. A better future.</p></Hero><Section eyebrow="What guides us" title="We keep it human, useful, and open."><div className="mt-10 grid gap-5 md:grid-cols-3"><Card icon={<Icon>↗</Icon>} title="Young people lead">We listen for what matters, rather than assuming one route works for everyone.</Card><Card icon={<Icon>◌</Icon>} title="Progress is personal">A useful next step might be a question, a new idea, or simply feeling less alone with it.</Card><Card icon={<Icon>◎</Icon>} title="Learning goes both ways">Mentors, families, and young people all bring knowledge worth sharing.</Card></div></Section><Section tone="cream" eyebrow="Our approach" title="Less pressure. More possibility."><p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">Nexus is a place to explore—not a place to have everything figured out. We focus on conversations, practical tools, and connections that can make the next step feel more possible.</p></Section></>; }








/*Welcome to Nexus RiseGen Alliance (NRA)
A youth-led movement dedicated to developing people, strengthening families, nurturing leaders, and transforming communities.
We bring together students, young professionals, mentors, and community members who are passionate about creating positive change through leadership, well-being, education, innovation, and service.
This is a space for: 
✅ Learning and growth
✅ Leadership development
✅ Community engagement
✅ Health and well-being awareness
✅ Mentorship and networking
✅ Innovation and problem-solving
✅ Meaningful conversations and collaboration
Together, we believe that empowered people create stronger families, stronger communities, and a better future.

Developing People. Transforming Communities.
Together We Rise. Together We Lead. Together We Transform.
🎯 Our Main Goal
To build a generation of healthy, capable, and purpose-driven leaders who strengthen families, transform communities, and create lasting social impact.
Our Objectives are;
1. Leadership Development.
2. Well-being Promotion
3. Education  Lifelong Learning
4. Family Strengthening
5. Community Transformation
6. Innovation  Future Readiness
7. Mentorship Networking
8. Volunteerism Service */
