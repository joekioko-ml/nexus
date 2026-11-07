from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

OUT = "public/nexus.pdf"
NAVY = colors.HexColor("#082864")
BLUE = colors.HexColor("#1269C4")
GREEN = colors.HexColor("#236443")
GOLD = colors.HexColor("#D9A430")
INK = colors.HexColor("#18314F")
MUTED = colors.HexColor("#53677E")
PALE = colors.HexColor("#F1F6F4")

doc = SimpleDocTemplate(OUT, pagesize=A4, rightMargin=20*mm, leftMargin=20*mm, topMargin=22*mm, bottomMargin=19*mm, title="Nexus RiseGen Initiative", author="Nexus RiseGen Initiative")
base = getSampleStyleSheet()
styles = {
    "eyebrow": ParagraphStyle("Eyebrow", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=9, leading=13, textColor=GREEN, spaceAfter=7, tracking=1.2),
    "title": ParagraphStyle("TitleNexus", parent=base["Title"], fontName="Helvetica-Bold", fontSize=29, leading=34, textColor=NAVY, alignment=TA_LEFT, spaceAfter=12),
    "lead": ParagraphStyle("Lead", parent=base["BodyText"], fontName="Helvetica", fontSize=13, leading=19, textColor=INK, spaceAfter=9),
    "h2": ParagraphStyle("H2Nexus", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=17, leading=22, textColor=NAVY, spaceBefore=12, spaceAfter=7),
    "h3": ParagraphStyle("H3Nexus", parent=base["Heading3"], fontName="Helvetica-Bold", fontSize=11, leading=15, textColor=GREEN, spaceBefore=5, spaceAfter=4),
    "body": ParagraphStyle("BodyNexus", parent=base["BodyText"], fontName="Helvetica", fontSize=10, leading=15, textColor=INK, spaceAfter=7),
    "small": ParagraphStyle("SmallNexus", parent=base["BodyText"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED, spaceAfter=4),
    "quote": ParagraphStyle("QuoteNexus", parent=base["BodyText"], fontName="Helvetica-Bold", fontSize=14, leading=20, textColor=GREEN, alignment=TA_CENTER, spaceBefore=7, spaceAfter=7),
    "cell": ParagraphStyle("CellNexus", parent=base["BodyText"], fontName="Helvetica", fontSize=9, leading=13, textColor=INK),
}

def P(text, style="body"):
    return Paragraph(text, styles[style])

def footer(canvas, document):
    canvas.saveState()
    w, _ = A4
    canvas.setStrokeColor(colors.HexColor("#DCE5E9"))
    canvas.line(20*mm, 14*mm, w-20*mm, 14*mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(20*mm, 9*mm, "NEXUS RISEGEN INITIATIVE  |  Developing people. Transforming communities.")
    canvas.drawRightString(w-20*mm, 9*mm, f"{document.page}")
    canvas.restoreState()

story = [
    Spacer(1, 12*mm), P("A COMMUNITY FOR GROWTH, GUIDANCE & CONNECTION", "eyebrow"),
    P("Nexus RiseGen Initiative", "title"),
    P("A youth-led, cross-generational mentorship and community-support initiative helping people learn, connect, and take meaningful next steps.", "lead"),
    Spacer(1, 4*mm),
]
quote = Table([[P("“Developing People. Transforming Communities.”", "quote")]], colWidths=[170*mm])
quote.setStyle(TableStyle([("BACKGROUND", (0,0),(-1,-1), PALE), ("BOX",(0,0),(-1,-1),0.7,GREEN), ("LEFTPADDING",(0,0),(-1,-1),12), ("RIGHTPADDING",(0,0),(-1,-1),12), ("TOPPADDING",(0,0),(-1,-1),11), ("BOTTOMPADDING",(0,0),(-1,-1),11)]))
story += [quote, Spacer(1, 7*mm), P("What Nexus is about", "h2"),
    P("Nexus creates welcoming spaces where young people and the adults around them can explore real-life questions through mentorship, practical learning, and community connection. The initiative is youth-led and cross-generational: students, young professionals, families, mentors, volunteers, and community members all have something valuable to contribute."),
    P("Nexus is designed to help people feel heard, recognize their strengths, build useful skills, and choose a next step that fits their own circumstances. It is a place for learning and supportive conversation, not pressure to have everything figured out."),
    P("Who the initiative serves", "h2"),
]
audience = [[P("YOUNG PEOPLE", "h3"), P("FAMILIES & CAREGIVERS", "h3"), P("MENTORS & COMMUNITY", "h3")],
            [P("Junior and senior school students, teenagers, university and TVET learners, and young adults.", "cell"), P("Families seeking practical ways to stay connected and support young people as they grow.", "cell"), P("Mentors, volunteers, professionals, and community members ready to listen, share, and learn.", "cell")]]
t = Table(audience, colWidths=[56*mm,56*mm,58*mm])
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),PALE),("BOX",(0,0),(-1,-1),0.5,colors.HexColor("#DCE5E9")),("INNERGRID",(0,0),(-1,-1),0.5,colors.white),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9)]))
story += [t, PageBreak(), P("OUR AREAS OF FOCUS", "eyebrow"), P("Learning for life and community", "title"), P("Nexus brings together learning, wellbeing, relationships, and purposeful action. These focus areas reflect the initiative brief and guide the programmes and resources on the platform.", "lead")]
areas = [
    ("Leadership & community transformation", "Personal growth, servant leadership, family strengthening, communication, and practical community contribution."),
    ("Mental wellness & navigating life", "Emotional awareness, resilience, healthy boundaries, trauma-informed understanding, and finding appropriate support."),
    ("Future readiness & career guidance", "Education pathways, career exploration, transferable skills, resume preparation, interviews, and networking."),
    ("Mentorship & connection", "Supportive conversations that listen first, respect each person’s voice, and help identify realistic next steps."),
    ("Family, learning & service", "Stronger relationships, lifelong learning, volunteering, innovation, and community-led problem solving."),
]
for title, body in areas:
    story.append(KeepTogether([P(title, "h3"), P(body)]))
story += [Spacer(1, 3*mm), P("How Nexus approaches support", "h2"),
          P("A good mentoring relationship is respectful and collaborative. Mentors can share experience, ask thoughtful questions, and help someone consider options; the young person remains the decision-maker. Small actions, consistent encouragement, and learning together can make growth feel more possible."),
          P("Wellbeing and safeguarding", "h2"),
          P("Nexus learning and peer mentorship can encourage reflection and connection, but they do not replace professional mental-health care, counselling, or emergency support. People should be treated with dignity, privacy, and care. Sensitive disclosures should be handled by an appropriate trusted adult or qualified professional, following the initiative’s safeguarding process. Digital tools should grow alongside programme capacity and safeguarding practices."),
          Spacer(1, 5*mm), P("Nexus RiseGen Initiative", "h3"),
          P("A space to learn, connect, and grow together. Programme details and public wording should be confirmed by the initiative as its work develops.", "small")]

doc.build(story, onFirstPage=footer, onLaterPages=footer)
