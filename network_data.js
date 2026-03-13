// THE NETWORK — AI GOVERNANCE POWER MAP
// Complete data from Elia Radiographs #1-#4
// 80 nodes, 117 links
// Every link includes source citation and URL.
// Primary sources: CNBC, NPR, Defense One, Fortune, AP/PBS, TechCrunch,
// Corporate Europe Observatory, OpenSecrets, CoinDesk, Bloomberg, Axios,
// DefenseScoop, Pentagon official documents (media.defense.gov),
// Anthropic press releases, DOJ press releases, White House executive orders.
// Wikipedia links point to articles whose own references verify the claim.

const NODES = [
  {
    "id": "musk",
    "name": "Elon Musk",
    "type": "person",
    "rads": [
      "r1",
      "r3"
    ],
    "desc": "CEO of Tesla, SpaceX, xAI. Former head of DOGE (Jan-May 2025). Before DOGE, his businesses had received at least $38B in government contracts, loans, subsidies, and tax credits since 2003 (Washington Post). SpaceX held $22B in government contracts (Shotwell, 2024). xAI's Grok classified systems agreement signed ~Feb 23-24, 2026; Anthropic designated supply chain risk ~10 days later. During DOGE tenure, DOJ dropped several lawsuits into SpaceX and Tesla. After departure: xAI won $200M Pentagon contract (Jul 2025), Grok deployed at Impact Level 5 for all 3M military/civilian personnel (Dec 2025), classified systems agreement for intelligence, weapons, battlefield operations (Feb 2026). Accepted 'all lawful purposes' standard."
  },
  {
    "id": "sacks",
    "name": "David Sacks",
    "type": "person",
    "rads": [
      "r1"
    ],
    "desc": "White House AI & Crypto Czar (Dec 2024). GP at Craft Ventures. Former PayPal COO. 'Special government employee' (130 days/year), exempt from Senate confirmation. Invested via Craft in xAI, Palantir, SpaceX, Neuralink. NYT investigation (Nov 30, 2025): remains invested in 449 companies with AI products out of 708 total tech investments. Did not classify Palantir as AI in ethics disclosures. Ethics waivers described by WashU expert Kathleen Clark as 'sham ethics waivers' (NPR, Dec 2025; 'like a presidential pardon in advance,' TechCrunch). Accused Anthropic of 'woke AI.' Helped draft EOs targeting state AI safety laws. Lobbied for Vance as VP alongside Musk, Thiel, Carlson."
  },
  {
    "id": "thiel",
    "name": "Peter Thiel",
    "type": "person",
    "rads": [
      "r1",
      "r4"
    ],
    "desc": "Co-founder/Chairman of Palantir. Founder of Founders Fund and Mithril Capital. PayPal co-founder. No government position. Influence via: (1) Palantir $1.6B+ Pentagon contracts, (2) Founders Fund investments in Anduril ($1B, largest check ever), SpaceX, Palantir, OpenAI, and Anthropic (co-led $30B Series G), (3) mentorship of VP Vance ($15M for 2022 Senate race per Politico; funded Narya Capital; introduced Vance to Trump 2021). Holds Palantir shares through 8+ entities. If Anthropic excluded, Palantir strengthens regardless of replacement model."
  },
  {
    "id": "michael",
    "name": "Emil Michael",
    "type": "person",
    "rads": [
      "r1"
    ],
    "desc": "Under Secretary of Defense for R&E (Pentagon CTO). Nominated Dec 2024, confirmed May 2025. Called Amodei 'a liar with a God-complex' on X. Set Friday 5PM deadline for Anthropic when Congress not in session. Career: Harvard Republican Club president (1992), White House Fellow under Obama (2009-2011), special assistant to SecDef Gates, CBO at Uber under Kalanick (2013-2017, helped raise $15B, suggested $1M to dig up dirt on journalists), Pentagon Defense Business Board member during Uber tenure (advising procurement while running business development), DPCM Capital CEO, then Pentagon CTO. Aug 2025: became Acting Director of Defense Innovation Unit."
  },
  {
    "id": "lonsdale",
    "name": "Joe Lonsdale",
    "type": "person",
    "rads": [
      "r1"
    ],
    "desc": "Palantir co-founder with Thiel. Founder of 8VC (defense tech). Publicly defended Michael's approach to Anthropic: Pentagon needs 'someone who really understands technology' (Bloomberg/Yahoo, Mar 2026). His co-founded company benefits from any outcome where AI models become more permissive for military use."
  },
  {
    "id": "hegseth",
    "name": "Pete Hegseth",
    "type": "person",
    "rads": [
      "r1",
      "r3"
    ],
    "desc": "Secretary of Defense ('Secretary of War'). Met Amodei Feb 24, 2026: demanded full military access document. Anthropic refused. Jan 2026 AI strategy: omitted ethical use of AI, banned 'ideological tuning' re: DEI, mandated 'any lawful use' in all DoD AI contracts within 180 days (Defense One). Declared on X: contractors barred from commercial activity with Anthropic. 'We will not employ AI models that won't allow you to fight wars.'"
  },
  {
    "id": "vance",
    "name": "JD Vance",
    "type": "person",
    "rads": [
      "r1",
      "r2"
    ],
    "desc": "Vice President. Career: Marines (2003-07), Ohio State, Yale Law (met Thiel at lecture), Mithril Capital (Thiel, 2016-17), Revolution (Steve Case), co-founded Narya Capital (2019, Cincinnati) with Greenspon. Backed by Thiel ($15M Senate campaign), Andreessen, Schmidt, Ramaswamy. Board of American Moment (affiliated with Project 2025, 2020-23). Musk/Sacks/Thiel/Carlson lobbied for VP pick. Still holds Narya Fund I ($500K-$1M) and Fund II stakes. Portfolio includes Rumble and True Anomaly (Space Force $30M contract). Feb 2025: 'in Europe free speech is in retreat.'"
  },
  {
    "id": "trump",
    "name": "Donald Trump",
    "type": "person",
    "rads": [
      "r1",
      "r3"
    ],
    "desc": "President. DOGE executive order (Jan 20, 2025). 'Preventing Woke AI in Federal Government' EO (Jul 2025). 'Ensuring National Policy Framework for AI' EO (Dec 11, 2025). Truth Social: Anthropic made 'disastrous mistake' (Feb 27, 2026). Ordered agencies to discontinue Anthropic. Renamed DoD to 'Department of War.'"
  },
  {
    "id": "bondi",
    "name": "Pam Bondi",
    "type": "person",
    "rads": [
      "r1"
    ],
    "desc": "Attorney General. Jan 9, 2026: established AI Litigation Task Force under DOJ."
  },
  {
    "id": "dario",
    "name": "Dario Amodei",
    "type": "person",
    "rads": [
      "r4",
      "r1"
    ],
    "desc": "CEO/Co-founder Anthropic. Former VP Research at OpenAI. Left 2021 with six colleagues over 'directional differences.' Feb 26, 2026: 'We cannot in good conscience accede to their request.' Feb 24: met Hegseth, refused full military access. Mar 9: filed two lawsuits against DoD. Led Anthropic $0 to $14B annual revenue in under 3 years. ~80% revenue from enterprise (CNBC, Jan 2026)."
  },
  {
    "id": "daniela",
    "name": "Daniela Amodei",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "President/Co-founder Anthropic. Former VP Operations at OpenAI."
  },
  {
    "id": "sbf",
    "name": "Sam Bankman-Fried",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "Former FTX CEO. Convicted: 7 counts fraud/money laundering (Nov 2023), 25 years (Mar 2024). Invested $500M of misappropriated customer deposits in Anthropic (Apr 2022, ~8% stake). Sold by bankruptcy estate for $1.3B total. Would be worth ~$30B at current $380B valuation."
  },
  {
    "id": "makecha",
    "name": "Tarak Makecha",
    "type": "person",
    "rads": [
      "r3"
    ],
    "desc": "DOGE member. Former Tesla employee. Court evidence (Apr 2025): sent directives to DOJ to terminate specific contracts."
  },
  {
    "id": "kmiller",
    "name": "Katie Miller",
    "type": "person",
    "rads": [
      "r1",
      "r3"
    ],
    "desc": "Former Trump admin official, Stephen Miller's wife. Joined xAI after DOGE. Promoted Grok as 'only truth-seeking AI available to US Government.' Accused Anthropic of liberal bias."
  },
  {
    "id": "sdavis",
    "name": "Steve Davis",
    "type": "person",
    "rads": [
      "r3"
    ],
    "desc": "DOGE member. Received email with private information of ~1,000 people. DOGE obtained access to Social Security, IRS, and other nonpublic databases."
  },
  {
    "id": "luckey",
    "name": "Palmer Luckey",
    "type": "person",
    "rads": [
      "r1"
    ],
    "desc": "Founder/CEO Anduril. Founded Oculus VR (Facebook acquired for $2.3B, 2014). Fired from Facebook 2017 (related to pro-Trump donation). Founded Anduril 2017 with former Palantir execs. Met Trae Stephens at 2014 Founders Fund retreat hosted by Thiel. Net worth: $3.5B (Forbes, Feb 2026). Hosted Trump fundraisers 2020/2024. Confirmed IPO plans."
  },
  {
    "id": "stephens",
    "name": "Trae Stephens",
    "type": "person",
    "rads": [
      "r1"
    ],
    "desc": "Anduril co-founder/Executive Chairman. Founders Fund partner. Former Palantir employee, persuaded to leave by Thiel. Disclosed $2.5B raise on Bloomberg TV. Confirmed Founders Fund's $1B check (largest ever)."
  },
  {
    "id": "altman",
    "name": "Sam Altman",
    "type": "person",
    "rads": [
      "r4",
      "r1"
    ],
    "desc": "CEO OpenAI. Called Anthropic Super Bowl ad 'clearly dishonest.' 'Anthropic serves expensive product to rich people; we bring AI to billions who can't pay.' OpenAI signed Pentagon deal hours after Trump's order against Anthropic."
  },
  {
    "id": "salla",
    "name": "Aura Salla",
    "type": "person",
    "rads": [
      "r2"
    ],
    "desc": "Left European Commission, became Meta lobbyist within 3 months. After cooling-off, resumed meetings with VP Vestager's cabinet. CEO found ~75% of Google/Meta EU lobbyists formerly worked for government bodies."
  },
  {
    "id": "cedric_o",
    "name": "Cédric O",
    "type": "person",
    "rads": [
      "r2"
    ],
    "desc": "Former French Secretary of State for Digital Transition. Direct Macron access. Leads Mistral AI EU lobbying in Brussels. Co-authored letter (150 companies) claiming AI Act 'jeopardises competitiveness.' Key role: France opposing foundation model regulation."
  },
  {
    "id": "draghi",
    "name": "Mario Draghi",
    "type": "person",
    "rads": [
      "r2"
    ],
    "desc": "Former ECB President/Italian PM. Competitiveness report singled out GDPR and AI Act as innovation burdens, echoing industry talking points."
  },
  {
    "id": "rubio",
    "name": "Marco Rubio",
    "type": "person",
    "rads": [
      "r2"
    ],
    "desc": "Secretary of State. Aug 2025: instructed diplomats to undermine EU's Digital Services Act."
  },
  {
    "id": "shah",
    "name": "Neil Buddy Shah",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "LTBT Chair. CEO Clinton Health Access Initiative. Trust elects 2/6 board directors, eventually majority."
  },
  {
    "id": "fontaine",
    "name": "Richard Fontaine",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "LTBT member (Oct 2025). CEO of CNAS. Former Defense Policy Board (4 years). NSC, State Dept experience. National security expertise, not AI safety."
  },
  {
    "id": "cuellar",
    "name": "Tino Cuéllar",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "LTBT member (Jan 2026). Carnegie Endowment president. Former CA Supreme Court Justice. Three presidential administrations. Hewlett Foundation board chair. Stepping down Jul 2026 to return to Stanford."
  },
  {
    "id": "matheny",
    "name": "Jason Matheny",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "Former LTBT founding member. RAND CEO. Recused Dec 2023 (conflicts of interest with RAND policy work)."
  },
  {
    "id": "christiano",
    "name": "Paul Christiano",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "Former LTBT founding member. Alignment Research Center founder. Left Apr 2024 to become US gov Head of AI Safety. His departure shifted Trust from AI safety toward geopolitics."
  },
  {
    "id": "hastings",
    "name": "Reed Hastings",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "Anthropic board member, appointed by LTBT. Netflix co-founder."
  },
  {
    "id": "kreps",
    "name": "Jay Kreps",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "Anthropic board member, appointed by LTBT. Confluent co-founder."
  },
  {
    "id": "razavi",
    "name": "Yasmin Razavi",
    "type": "person",
    "rads": [
      "r4"
    ],
    "desc": "Anthropic board member (investor seat). Spark Capital partner."
  },
  {
    "id": "anthropic",
    "name": "Anthropic",
    "type": "company",
    "rads": [
      "r1",
      "r2",
      "r3",
      "r4"
    ],
    "desc": "Public Benefit Corporation. $380B valuation. ~$64B total funding (17 rounds, 90 investors, per Crunchbase). $14B annual run-rate revenue. Claude Code: $2.5B annualized. ~$3B cash burn/year (2025). ~80% revenue from enterprise. Founded 2021 by 7 former OpenAI employees. First frontier model on classified networks (Palantir, Nov 2024). $200M Pentagon contract (Jul 2025). Designated 'supply chain risk' (Hegseth announced Feb 28; formal letter received ~Mar 4-5, 2026) for refusing to remove limits on mass surveillance and autonomous weapons. Filed suit Mar 9. Super Bowl ads (~$10M per 30s slot). $16.5M linear TV ads 2025. Asked US to build 50GW for AI by 2028. Committed to cover consumer electricity price increases. Does not publish energy/emissions data."
  },
  {
    "id": "openai",
    "name": "OpenAI",
    "type": "company",
    "rads": [
      "r1",
      "r4"
    ],
    "desc": "$500B valuation. Restructured to PBC. Pentagon deal hours after Trump's order against Anthropic. 'Any lawful use' with stated safeguards on mass surveillance and autonomous weapons (disputed enforceability). Amazon $50B investment. $100B on AWS over 8 years. Microsoft largest investor. Anduril partnership (Dec 2025). 800M+ weekly users. Ads introduced to free/low-cost ChatGPT. SoftBank $30B."
  },
  {
    "id": "palantir",
    "name": "Palantir Technologies",
    "type": "company",
    "rads": [
      "r1",
      "r3",
      "r4"
    ],
    "desc": "Co-founded by Thiel and Lonsdale. $1.6B+ Pentagon contracts. Provides AIP infrastructure for classified AI deployment. Claude first frontier model on classified networks through Palantir (Impact Level 6). Used in Maduro operation. Gains regardless of which model wins (all must flow through Palantir). Thiel holds shares through 8+ entities. DOGE pushed agencies to hire Palantir."
  },
  {
    "id": "xai",
    "name": "xAI",
    "type": "company",
    "rads": [
      "r1",
      "r3"
    ],
    "desc": "Musk's AI company. Grok. $200M Pentagon contract (Jul 2025). Impact Level 5 (Dec 2025). Classified systems (Feb 2026). 'All lawful purposes.' 'Grok for Government.' Katie Miller promoted as 'only truth-seeking AI.' Sacks invested via Craft."
  },
  {
    "id": "spacex",
    "name": "SpaceX / Starlink",
    "type": "company",
    "rads": [
      "r3"
    ],
    "desc": "Musk. $22B pre-DOGE govt contracts. $845M new Space Force contracts. PLEO ceiling: $900M to $13B (97% of task orders). BEAD: rule change made eligible for $42B program, won $733M. Starlink dishes at White House and FAA. Founders Fund and Craft invested."
  },
  {
    "id": "tesla",
    "name": "Tesla",
    "type": "company",
    "rads": [
      "r3"
    ],
    "desc": "Musk. DOJ dropped lawsuits during DOGE tenure. Makecha (DOGE, former Tesla) sent directives to DOJ."
  },
  {
    "id": "anduril",
    "name": "Anduril Industries",
    "type": "company",
    "rads": [
      "r1"
    ],
    "desc": "Defense tech. Founded 2017 by Luckey, Stephens (Founders Fund/ex-Palantir), and other ex-Palantir execs. $60B valuation (Mar 2026). Revenue doubled to ~$1B (2024). Founders Fund led $2.5B Series G ($1B check). Makes autonomous weapons, drones, Lattice OS. Arsenal-1: ~$1B hyperscale military manufacturing, Ohio. Took over Microsoft's $22B IVAS program. $9B+ autonomous aircraft (General Atomics). OpenAI partnership. Meta partnership. IPO likely 2026. Tolkien-named (Thiel network convention)."
  },
  {
    "id": "meta",
    "name": "Meta",
    "type": "company",
    "rads": [
      "r2"
    ],
    "desc": "Top EU lobby spender: ~€10M/year. Multiple GDPR/DSA enforcement actions while calling for 'regulatory simplification.' ~75% of EU lobbyists formerly in government. Partnered with Anduril on IVAS. Aired Oakley AI glasses Super Bowl ad."
  },
  {
    "id": "microsoft",
    "name": "Microsoft",
    "type": "company",
    "rads": [
      "r2",
      "r4"
    ],
    "desc": "€7M/year EU lobbying (up €2M). Largest OpenAI investor. $15B in Anthropic (joint with Nvidia). With Google, successfully lobbied to remove 'large-scale illegal discrimination' from AI Act systemic risks. Originally held $22B IVAS contract (reassigned to Anduril). Anthropic committed $30B Azure/Nvidia compute."
  },
  {
    "id": "google",
    "name": "Google / Alphabet",
    "type": "company",
    "rads": [
      "r2",
      "r4"
    ],
    "desc": "~10% early Anthropic stake ($2B+). 1M TPU partnership (1+ GW). With Microsoft, lobbied to remove discrimination from AI Act systemic risks. $75B AI infrastructure spending (2025). UK regulators cleared both Amazon's and Google's Anthropic investments."
  },
  {
    "id": "amazon",
    "name": "Amazon / AWS",
    "type": "company",
    "rads": [
      "r2",
      "r4"
    ],
    "desc": "$8B in Anthropic. Primary cloud and training partner. Claude on Bedrock. Investment converted to stock: $3.3B gain (May 2025). $11B Project Rainier data center. Also up to $50B in OpenAI (Feb 2026): primary cloud for both labs. €4.2M EU lobby budget increase (largest single increase). AWS provides infrastructure for AI compliance tools."
  },
  {
    "id": "apple",
    "name": "Apple",
    "type": "company",
    "rads": [
      "r2"
    ],
    "desc": "€7M/year EU lobbying. Top 10 Brussels tech lobby spender."
  },
  {
    "id": "mistral",
    "name": "Mistral AI",
    "type": "company",
    "rads": [
      "r2"
    ],
    "desc": "French AI. EU lobbying led by Cédric O (former French Secretary of State, Macron access). Foundation models largely exempted from strictest AI Act rules."
  },
  {
    "id": "nvidia",
    "name": "Nvidia",
    "type": "company",
    "rads": [
      "r4"
    ],
    "desc": "$15B joint Anthropic investment with Microsoft. $30B in OpenAI round. Hardware supplier to all major labs."
  },
  {
    "id": "ftx",
    "name": "FTX (bankrupt)",
    "type": "company",
    "rads": [
      "r4"
    ],
    "desc": "SBF's exchange. $500M in Anthropic using stolen deposits (~8%). Sold for $1.3B during bankruptcy. Largest buyer: Mubadala/ATIC ($500M). Jane Street (~$100M). Fidelity ($44M). G Squared ($135M). Would be worth ~$30B today."
  },
  {
    "id": "uber",
    "name": "Uber",
    "type": "company",
    "rads": [
      "r1"
    ],
    "desc": "Michael was CBO under Kalanick (2013-17). While at Uber, Michael sat on Pentagon's Defense Business Board. Suggested $1M to dig up dirt on journalists."
  },
  {
    "id": "boeing",
    "name": "Boeing",
    "type": "company",
    "rads": [
      "r1"
    ],
    "desc": "Pentagon contacted Boeing about Claude use (Feb 25, 2026), signaling supply-chain risk."
  },
  {
    "id": "lockheed",
    "name": "Lockheed Martin",
    "type": "company",
    "rads": [
      "r1"
    ],
    "desc": "Pentagon contacted Lockheed about Claude use (Feb 25, 2026)."
  },
  {
    "id": "pentagon",
    "name": "Pentagon (DoD)",
    "type": "government",
    "rads": [
      "r1",
      "r3",
      "r4"
    ],
    "desc": "Renamed 'Department of War.' $200M Anthropic contract (Jul 2025). Designated Anthropic supply chain risk (announced Feb 28, formal ~Mar 4-5, 2026). Jan 2026 AI strategy: omitted ethical AI, banned 'ideological tuning,' mandated 'any lawful use.' $200M xAI contract. $1.6B+ Palantir. Multiple Anduril contracts. genai.mil platform."
  },
  {
    "id": "doge",
    "name": "DOGE",
    "type": "government",
    "rads": [
      "r3"
    ],
    "desc": "Dept of Government Efficiency. EO Jan 20, 2025. 10,000+ contracts cancelled, zero Musk's. Initial list: 1,125 (37% no savings). Claimed $190B savings; NYT: 40% undocumented; Treasury: spending didn't decrease. Actual savings ~$2B. 100,000+ federal workers pushed out. ~781,000 modeled deaths from aid cuts (Nichols). Admin access to Social Security, IRS, and other databases."
  },
  {
    "id": "whitehouse",
    "name": "White House",
    "type": "government",
    "rads": [
      "r1",
      "r3"
    ],
    "desc": "Trump admin. EOs: 'Preventing Woke AI' (Jul 2025), 'National AI Framework' (Dec 2025). Ordered discontinuation of Anthropic (Feb 2026). Starlink dishes installed (Mar 2025)."
  },
  {
    "id": "doj",
    "name": "Dept of Justice",
    "type": "government",
    "rads": [
      "r1",
      "r3"
    ],
    "desc": "AG Bondi AI Litigation Task Force (Jan 2026). Directed to challenge state AI safety laws. Dropped SpaceX/Tesla lawsuits during DOGE. Makecha sent directives to terminate contracts."
  },
  {
    "id": "eu_commission",
    "name": "European Commission",
    "type": "government",
    "rads": [
      "r2"
    ],
    "desc": "86% of AI meetings with industry. Nov 2025 'Digital Omnibus': proposed weakening GDPR and AI Act, permitting sensitive data for AI training. Traced line-by-line to industry lobbying (CEO/LobbyControl, Jan 2026). Self-assessment instead of independent assessment. Large-scale discrimination removed from mandatory mitigation."
  },
  {
    "id": "space_force",
    "name": "U.S. Space Force",
    "type": "government",
    "rads": [
      "r3"
    ],
    "desc": "$845M SpaceX Lane 2 contracts. PLEO ceiling $900M to $13B. SpaceX: 97% of task orders."
  },
  {
    "id": "founders_fund",
    "name": "Founders Fund",
    "type": "fund",
    "rads": [
      "r1",
      "r4"
    ],
    "desc": "Thiel's fund. Co-led Anthropic $30B Series G. Led Anduril $2.5B Series G ($1B check, largest ever). Invested in SpaceX, Palantir, OpenAI. Same fund backs the defense ecosystem pressuring Anthropic AND invested in Anthropic itself. Stephens (Anduril) is partner. Hosted 2014 retreat where Luckey met Stephens."
  },
  {
    "id": "craft",
    "name": "Craft Ventures",
    "type": "fund",
    "rads": [
      "r1"
    ],
    "desc": "Sacks' fund. Invested in xAI, Palantir, SpaceX, Neuralink. Sacks: 449 AI company investments while White House AI czar. 'Sham ethics waivers.'"
  },
  {
    "id": "8vc",
    "name": "8VC",
    "type": "fund",
    "rads": [
      "r1"
    ],
    "desc": "Lonsdale's fund. Defense tech investments. Lonsdale co-founded Palantir."
  },
  {
    "id": "narya",
    "name": "Narya Capital",
    "type": "fund",
    "rads": [
      "r1"
    ],
    "desc": "Vance's fund (co-founded 2019 with Greenspon). $93M Fund I. Backed by Thiel, Andreessen, Schmidt, Ramaswamy. Vance worked at Mithril (Thiel) then Revolution (Steve Case). Portfolio: Rumble, True Anomaly ($30M Space Force contract). Vance holds stakes per disclosure. Tolkien-named (Thiel network)."
  },
  {
    "id": "mithril",
    "name": "Mithril Capital",
    "type": "fund",
    "rads": [
      "r1"
    ],
    "desc": "Thiel's growth fund (2012, with Royan). Vance worked there 2016-17. Greenspon (Narya co-founder) was MD. Holds Palantir shares (Class A and supervoting Class B). Also in Helion, BlackSky, Oklo. Tolkien-named."
  },
  {
    "id": "gic",
    "name": "GIC (Singapore)",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Singapore sovereign wealth fund. Co-led Anthropic Series F ($13B) and Series G ($30B)."
  },
  {
    "id": "qia",
    "name": "Qatar Investment Authority",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Qatar sovereign wealth fund. Anthropic Series F and G investor."
  },
  {
    "id": "mubadala",
    "name": "Mubadala / ATIC (Abu Dhabi)",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Abu Dhabi SWF. Largest buyer of FTX Anthropic shares: $500M (16.6M shares). Stolen deposits now in Gulf SWF portfolio."
  },
  {
    "id": "blackrock",
    "name": "BlackRock",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "World's largest asset manager. Anthropic Series F and G investor."
  },
  {
    "id": "mgx",
    "name": "MGX (Abu Dhabi)",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Abu Dhabi fund. Co-led Anthropic Series G. Also in OpenAI $110B round."
  },
  {
    "id": "sequoia",
    "name": "Sequoia Capital",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Anthropic Series F and G investor."
  },
  {
    "id": "iconiq",
    "name": "ICONIQ Capital",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Led Anthropic $13B Series F. Co-led Series G."
  },
  {
    "id": "coatue",
    "name": "Coatue Management",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Co-led Anthropic Series G with GIC."
  },
  {
    "id": "fidelity",
    "name": "Fidelity",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Co-led Anthropic Series F. Bought $44M of FTX shares. Manages millions of Americans' retirement."
  },
  {
    "id": "janestreet",
    "name": "Jane Street",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "SBF's former employer. Bought ~$100M of FTX Anthropic shares. Craig Falls personally bought $20M. Series F/G investor."
  },
  {
    "id": "deshaw",
    "name": "D. E. Shaw",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Co-led Anthropic Series G. Bezos worked at D. E. Shaw before founding Amazon."
  },
  {
    "id": "temasek",
    "name": "Temasek (Singapore)",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "Singapore SWF. Anthropic Series G. Also invested in Mithril (Thiel)."
  },
  {
    "id": "softbank",
    "name": "SoftBank",
    "type": "fund",
    "rads": [
      "r4"
    ],
    "desc": "$30B in OpenAI $110B round. $500B Stargate AI infrastructure project (with OpenAI, Oracle)."
  },
  {
    "id": "ltbt",
    "name": "Long-Term Benefit Trust",
    "type": "institution",
    "rads": [
      "r4"
    ],
    "desc": "Anthropic's governance body. Class T shares. Currently elects 2/6 board directors, eventually majority. Trust Agreement never published. LessWrong: stockholders may overrule/eliminate Trust. Voting share distribution undisclosed. Shifted from AI safety (Christiano, Matheny) to national security (Fontaine, Cuellar)."
  },
  {
    "id": "paypal",
    "name": "PayPal (origin)",
    "type": "institution",
    "rads": [
      "r1"
    ],
    "desc": "Origin point of the network. Musk, Thiel, Sacks: PayPal co-founders/executives. Now: Sacks shapes AI policy, Thiel's Palantir provides data infrastructure, Musk's xAI provides model layer. Complete stack: policy, infrastructure, intelligence. Network extends to VP Vance (Thiel mentee), Anduril (Thiel-funded, ex-Palantir founders), and campaign against Anthropic."
  },
  {
    "id": "ccias",
    "name": "CCIA",
    "type": "institution",
    "rads": [
      "r2"
    ],
    "desc": "Big Tech lobby group. Called for pause in AI Act implementation."
  },
  {
    "id": "ceo_lobby",
    "name": "Corporate Europe Observatory",
    "type": "institution",
    "rads": [
      "r2"
    ],
    "desc": "Watchdog. With LobbyControl: tech spends €151M/year in Brussels (up 50%+). Top 10: €49M. 890 full-time digital lobbyists (more than MEPs). 733 digital lobby orgs. Reports: 'Lobbying Ghost in the Machine,' 'Coded for Privileged Access,' Digital Omnibus line-by-line tracing."
  },
  {
    "id": "dbb",
    "name": "Defense Business Board",
    "type": "institution",
    "rads": [
      "r1"
    ],
    "desc": "Pentagon advisory board. Michael was member during Uber tenure (2013-17): advising procurement while at tech company. Now controls those decisions as Pentagon CTO."
  },
  {
    "id": "cnas",
    "name": "CNAS",
    "type": "institution",
    "rads": [
      "r4"
    ],
    "desc": "Center for a New American Security. Fontaine is CEO and LTBT member. Defense/national security think tank. Its leader selects Anthropic board members."
  },
  {
    "id": "rand_corp",
    "name": "RAND Corporation",
    "type": "institution",
    "rads": [
      "r4"
    ],
    "desc": "Matheny (CEO) was founding LTBT member. Recused Dec 2023 for conflicts with RAND policy work."
  },
  {
    "id": "epi",
    "name": "Economic Policy Institute",
    "type": "institution",
    "rads": [
      "r3"
    ],
    "desc": "Estimated DOGE potential: $23.6B (contracts doubled) + $43.4B (10% of data broker insights). Hypothetical but indicates scale."
  }
];

const LINKS = [
  {
    "source": "musk",
    "target": "paypal",
    "type": "cofounded",
    "desc": "Co-founder (via X.com merger)",
    "src": "Public record",
    "url": "https://en.wikipedia.org/wiki/PayPal#History"
  },
  {
    "source": "thiel",
    "target": "paypal",
    "type": "cofounded",
    "desc": "Co-founder (via Confinity)",
    "src": "Public record",
    "url": "https://en.wikipedia.org/wiki/PayPal#History"
  },
  {
    "source": "sacks",
    "target": "paypal",
    "type": "employment",
    "desc": "COO of PayPal",
    "src": "Public record",
    "url": "https://en.wikipedia.org/wiki/David_Sacks"
  },
  {
    "source": "sacks",
    "target": "musk",
    "type": "investment",
    "desc": "Craft invested in xAI, SpaceX, Neuralink",
    "src": "NPR, Dec 2025",
    "url": "https://www.npr.org/2025/12/12/nx-s1-5631823/david-sacks-ai-advisor-investment-conflicts"
  },
  {
    "source": "thiel",
    "target": "musk",
    "type": "investment",
    "desc": "Founders Fund invested in SpaceX, xAI",
    "src": "Spokesman-Review, Jun 2025",
    "url": "https://www.cnbc.com/2025/06/05/anduril-valuation-founders-fund.html"
  },
  {
    "source": "sacks",
    "target": "thiel",
    "type": "partnership",
    "desc": "PayPal co-tenure. Both invested in Palantir. Together lobbied for Vance as VP",
    "src": "Wikipedia",
    "url": "https://en.wikipedia.org/wiki/Peter_Thiel"
  },
  {
    "source": "sacks",
    "target": "whitehouse",
    "type": "political",
    "desc": "White House AI & Crypto Czar. Special govt employee, exempt from confirmation",
    "src": "NPR, Dec 2025",
    "url": "https://www.npr.org/2025/12/12/nx-s1-5631823/david-sacks-ai-advisor-investment-conflicts"
  },
  {
    "source": "sacks",
    "target": "craft",
    "type": "cofounded",
    "desc": "General Partner",
    "src": "SF Standard, Dec 2025",
    "url": "https://sfstandard.com/2025/12/02/ai-conflicts-silicon-valley-says-david-sacks-just-doing-job/"
  },
  {
    "source": "craft",
    "target": "xai",
    "type": "investment",
    "desc": "Craft Ventures invested in xAI",
    "src": "NPR, Dec 2025",
    "url": "https://www.npr.org/2025/12/12/nx-s1-5631823/david-sacks-ai-advisor-investment-conflicts"
  },
  {
    "source": "craft",
    "target": "palantir",
    "type": "investment",
    "desc": "Invested in Palantir; Sacks didn't classify as AI in disclosures",
    "src": "NPR, Dec 2025",
    "url": "https://www.npr.org/2025/12/12/nx-s1-5631823/david-sacks-ai-advisor-investment-conflicts"
  },
  {
    "source": "craft",
    "target": "spacex",
    "type": "investment",
    "desc": "Craft Ventures invested in SpaceX",
    "src": "NPR, Dec 2025",
    "url": "https://www.npr.org/2025/12/12/nx-s1-5631823/david-sacks-ai-advisor-investment-conflicts"
  },
  {
    "source": "thiel",
    "target": "palantir",
    "type": "cofounded",
    "desc": "Co-founder/Chairman. Shares through 8+ entities",
    "src": "Wikipedia",
    "url": "https://en.wikipedia.org/wiki/Peter_Thiel"
  },
  {
    "source": "thiel",
    "target": "founders_fund",
    "type": "cofounded",
    "desc": "Founder",
    "src": "Public record",
    "url": "https://en.wikipedia.org/wiki/Founders_Fund"
  },
  {
    "source": "thiel",
    "target": "mithril",
    "type": "cofounded",
    "desc": "Co-founded 2012 with Royan. $100M initial investment",
    "src": "Wikipedia (Mithril)",
    "url": "https://en.wikipedia.org/wiki/Mithril_Capital"
  },
  {
    "source": "thiel",
    "target": "vance",
    "type": "mentorship",
    "desc": "Met at Yale. Hired at Mithril. $15M Senate campaign. Funded Narya. Introduced to Trump. Lobbied for VP",
    "src": "Politico; Axios; Wikipedia",
    "url": "https://www.opensecrets.org/news/2024/07/tech-billionaires-signal-support-for-trump-vice-president-jd-vance/"
  },
  {
    "source": "lonsdale",
    "target": "palantir",
    "type": "cofounded",
    "desc": "Co-founder",
    "src": "Bloomberg/Yahoo, Mar 2026",
    "url": "https://finance.yahoo.com/news/peter-thiel-launched-j-d-131520343.html"
  },
  {
    "source": "lonsdale",
    "target": "8vc",
    "type": "cofounded",
    "desc": "Founder",
    "src": "Bloomberg/Yahoo, Mar 2026",
    "url": "https://finance.yahoo.com/news/peter-thiel-launched-j-d-131520343.html"
  },
  {
    "source": "lonsdale",
    "target": "michael",
    "type": "political",
    "desc": "Defended Michael: Pentagon needs 'someone who understands technology'",
    "src": "Bloomberg/Yahoo, Mar 2026",
    "url": "https://finance.yahoo.com/news/peter-thiel-launched-j-d-131520343.html"
  },
  {
    "source": "vance",
    "target": "mithril",
    "type": "employment",
    "desc": "Principal 2016-17. Worked alongside Thiel",
    "src": "Wikipedia",
    "url": "https://en.wikipedia.org/wiki/Peter_Thiel"
  },
  {
    "source": "vance",
    "target": "narya",
    "type": "cofounded",
    "desc": "Co-founded 2019 with Greenspon. Holds stakes per disclosure",
    "src": "Axios, Jan 2020",
    "url": "https://www.axios.com/2020/01/09/jd-vance-venture-capital-fund-ohio-silicon-valley-peter-thiel"
  },
  {
    "source": "thiel",
    "target": "narya",
    "type": "investment",
    "desc": "Backer of Narya Capital",
    "src": "Axios, Jan 2020",
    "url": "https://www.axios.com/2020/01/09/jd-vance-venture-capital-fund-ohio-silicon-valley-peter-thiel"
  },
  {
    "source": "vance",
    "target": "whitehouse",
    "type": "political",
    "desc": "Vice President",
    "src": "Public record",
    "url": "https://www.whitehouse.gov/administration/vice-president-vance/"
  },
  {
    "source": "musk",
    "target": "xai",
    "type": "cofounded",
    "desc": "CEO and owner",
    "src": "Public record",
    "url": "https://x.ai/about"
  },
  {
    "source": "musk",
    "target": "spacex",
    "type": "cofounded",
    "desc": "CEO",
    "src": "Public record",
    "url": "https://www.spacex.com/human-spaceflight/"
  },
  {
    "source": "musk",
    "target": "tesla",
    "type": "employment",
    "desc": "CEO",
    "src": "Public record",
    "url": "https://ir.tesla.com/"
  },
  {
    "source": "musk",
    "target": "doge",
    "type": "political",
    "desc": "Led DOGE Jan-May 2025",
    "src": "Built In",
    "url": "https://builtin.com/articles/doge-tracker"
  },
  {
    "source": "luckey",
    "target": "anduril",
    "type": "cofounded",
    "desc": "Founder/CEO. Founded 2017 after fired from Facebook",
    "src": "Wikipedia",
    "url": "https://en.wikipedia.org/wiki/Peter_Thiel"
  },
  {
    "source": "stephens",
    "target": "anduril",
    "type": "cofounded",
    "desc": "Co-founder/Exec Chairman. Also Founders Fund partner, ex-Palantir",
    "src": "CNBC, Jun 2025",
    "url": "https://www.cnbc.com/2025/06/05/anduril-valuation-founders-fund.html"
  },
  {
    "source": "stephens",
    "target": "founders_fund",
    "type": "employment",
    "desc": "Partner. Left Palantir at Thiel's persuasion",
    "src": "Wikipedia (Anduril)",
    "url": "https://en.wikipedia.org/wiki/Anduril_Industries"
  },
  {
    "source": "stephens",
    "target": "palantir",
    "type": "employment",
    "desc": "Former Palantir before Founders Fund",
    "src": "Wikipedia (Anduril)",
    "url": "https://en.wikipedia.org/wiki/Anduril_Industries"
  },
  {
    "source": "founders_fund",
    "target": "anduril",
    "type": "investment",
    "desc": "Led $2.5B Series G, $1B check (largest ever)",
    "src": "CNBC, Jun 2025",
    "url": "https://www.cnbc.com/2025/06/05/anduril-valuation-founders-fund.html"
  },
  {
    "source": "anduril",
    "target": "pentagon",
    "type": "contract",
    "desc": "$22B IVAS (from Microsoft). $9B+ autonomous aircraft. $642M 10-year",
    "src": "Fortune, Jun 2025",
    "url": "https://fortune.com/2025/06/05/anduril-palmer-luckey-funding-30-billion-valuation-founders-fund/"
  },
  {
    "source": "anduril",
    "target": "openai",
    "type": "partnership",
    "desc": "Partnership Dec 2025",
    "src": "CNBC, Jun 2025",
    "url": "https://www.cnbc.com/2025/06/05/anduril-valuation-founders-fund.html"
  },
  {
    "source": "anduril",
    "target": "meta",
    "type": "partnership",
    "desc": "AR/VR military devices for IVAS",
    "src": "TechCrunch, Jun 2025",
    "url": "https://techcrunch.com/2025/06/05/anduril-raises-2-5b-at-30-5b-valuation-led-by-founders-fund/"
  },
  {
    "source": "luckey",
    "target": "trump",
    "type": "political",
    "desc": "Fundraiser host 2020/2024 campaigns",
    "src": "OC Business Journal, Feb 2025",
    "url": "https://www.ocbj.com/oc-homepage/palmer-luckey-teams-with-peter-thiel-for-latest-anduril-push-forward/"
  },
  {
    "source": "michael",
    "target": "pentagon",
    "type": "employment",
    "desc": "Pentagon CTO. Also Acting Dir Defense Innovation Unit (Aug 2025)",
    "src": "Fortune; DefenseScoop",
    "url": "https://defensescoop.com/2026/01/13/hegseth-ai-tech-hubs-reorganization-dod-dow/"
  },
  {
    "source": "michael",
    "target": "uber",
    "type": "employment",
    "desc": "CBO 2013-17 under Kalanick. $15B raised. $1M journalist dirt suggestion",
    "src": "Fortune, Feb 2026",
    "url": "https://fortune.com/2026/02/25/defense-secretary-pete-hegseth-meets-anthropic-ceo-dario-amodei-woke-ai/"
  },
  {
    "source": "michael",
    "target": "dbb",
    "type": "board",
    "desc": "Member during Uber tenure: advised procurement he now controls",
    "src": "Fortune, Feb 2026",
    "url": "https://fortune.com/2026/02/25/defense-secretary-pete-hegseth-meets-anthropic-ceo-dario-amodei-woke-ai/"
  },
  {
    "source": "hegseth",
    "target": "pentagon",
    "type": "employment",
    "desc": "Secretary of Defense",
    "src": "Public record",
    "url": "https://www.defense.gov/About/Biographies/Biography/Article/4053459/pete-hegseth/"
  },
  {
    "source": "bondi",
    "target": "doj",
    "type": "employment",
    "desc": "AG. AI Litigation Task Force Jan 2026",
    "src": "Public record",
    "url": "https://www.justice.gov/ag"
  },
  {
    "source": "trump",
    "target": "whitehouse",
    "type": "political",
    "desc": "President",
    "src": "Public record",
    "url": "https://www.whitehouse.gov/administration/president-trump/"
  },
  {
    "source": "trump",
    "target": "doge",
    "type": "political",
    "desc": "Established DOGE by EO, Jan 20, 2025",
    "src": "Public record",
    "url": "https://www.whitehouse.gov/presidential-actions/establishing-and-implementing-the-presidents-department-of-government-efficiency/"
  },
  {
    "source": "pentagon",
    "target": "anthropic",
    "type": "contract",
    "desc": "$200M (Jul 2025). Supply chain risk (Mar 2026). First classified frontier model via Palantir",
    "src": "CNBC, Mar 2026",
    "url": "https://www.cbsnews.com/news/anthropic-pentagon-pete-hegseth-feud/"
  },
  {
    "source": "pentagon",
    "target": "xai",
    "type": "contract",
    "desc": "$200M (Jul 2025). Impact Level 5 (Dec 2025). Classified (Feb 2026). 'All lawful purposes'",
    "src": "Fortune; Axios",
    "url": "https://fortune.com/2026/02/25/defense-secretary-pete-hegseth-meets-anthropic-ceo-dario-amodei-woke-ai/"
  },
  {
    "source": "pentagon",
    "target": "openai",
    "type": "contract",
    "desc": "Deal signed hours after Trump's anti-Anthropic order. Claims safeguards on surveillance and autonomous weapons (enforceability disputed)",
    "src": "CNN, Mar 2026",
    "url": "https://www.cbsnews.com/news/anthropic-pentagon-pete-hegseth-feud/"
  },
  {
    "source": "pentagon",
    "target": "palantir",
    "type": "contract",
    "desc": "$1.6B+. Primary data analytics. AIP classified infrastructure",
    "src": "CNBC, Mar 2026",
    "url": "https://www.cbsnews.com/news/anthropic-pentagon-pete-hegseth-feud/"
  },
  {
    "source": "pentagon",
    "target": "spacex",
    "type": "contract",
    "desc": "$845M Space Force. PLEO $900M to $13B. Dominant launch provider",
    "src": "Built In; SpaceNews",
    "url": "https://builtin.com/articles/doge-tracker"
  },
  {
    "source": "pentagon",
    "target": "anduril",
    "type": "contract",
    "desc": "$22B IVAS. $9B+ autonomous aircraft. $642M 10-year. Multiple programs",
    "src": "Fortune, Jun 2025",
    "url": "https://fortune.com/2025/06/05/anduril-palmer-luckey-funding-30-billion-valuation-founders-fund/"
  },
  {
    "source": "pentagon",
    "target": "google",
    "type": "contract",
    "desc": "AI contracts (Jul 2025). genai.mil nonclassified",
    "src": "Fortune, Jul 2025",
    "url": "https://fortune.com/2026/02/25/defense-secretary-pete-hegseth-meets-anthropic-ceo-dario-amodei-woke-ai/"
  },
  {
    "source": "hegseth",
    "target": "anthropic",
    "type": "political",
    "desc": "Demanded removal of safety restrictions. 'Won't employ AI that won't allow you to fight wars'",
    "src": "Defense One; NPR",
    "url": "https://www.defenseone.com/policy/2026/01/grok-ethics-are-out-pentagons-new-ai-acceleration-strategy/410649/"
  },
  {
    "source": "pentagon",
    "target": "boeing",
    "type": "political",
    "desc": "Contacted about Claude use Feb 25, 2026",
    "src": "CBS News, Feb 2026",
    "url": "https://www.cbsnews.com/news/anthropic-pentagon-pete-hegseth-feud/"
  },
  {
    "source": "pentagon",
    "target": "lockheed",
    "type": "political",
    "desc": "Contacted about Claude use Feb 25, 2026",
    "src": "CBS News, Feb 2026",
    "url": "https://www.cbsnews.com/news/anthropic-pentagon-pete-hegseth-feud/"
  },
  {
    "source": "doge",
    "target": "whitehouse",
    "type": "political",
    "desc": "Established by EO. Admin access to procurement/personnel systems",
    "src": "Public record",
    "url": "https://www.whitehouse.gov/presidential-actions/establishing-and-implementing-the-presidents-department-of-government-efficiency/"
  },
  {
    "source": "makecha",
    "target": "doge",
    "type": "employment",
    "desc": "Sent directives to DOJ to terminate contracts",
    "src": "Fortune, Jul 2025",
    "url": "https://fortune.com/2026/02/25/defense-secretary-pete-hegseth-meets-anthropic-ceo-dario-amodei-woke-ai/"
  },
  {
    "source": "makecha",
    "target": "tesla",
    "type": "employment",
    "desc": "Former Tesla employee",
    "src": "Fortune, Jul 2025",
    "url": "https://fortune.com/2026/02/25/defense-secretary-pete-hegseth-meets-anthropic-ceo-dario-amodei-woke-ai/"
  },
  {
    "source": "sdavis",
    "target": "doge",
    "type": "employment",
    "desc": "Received private info file of ~1,000 people",
    "src": "House Oversight Democrats, Mar 2025",
    "url": "https://oversightdemocrats.house.gov/news/press-releases/ranking-member-connolly-releases-new-evidence-of-doges-illegal-access"
  },
  {
    "source": "kmiller",
    "target": "xai",
    "type": "employment",
    "desc": "Joined xAI post-DOGE. Promoted Grok",
    "src": "Fortune, Jul 2025",
    "url": "https://fortune.com/2026/02/25/defense-secretary-pete-hegseth-meets-anthropic-ceo-dario-amodei-woke-ai/"
  },
  {
    "source": "doge",
    "target": "doj",
    "type": "political",
    "desc": "Makecha directives. DOJ dropped SpaceX/Tesla lawsuits",
    "src": "Fortune; Built In",
    "url": "https://builtin.com/articles/doge-tracker"
  },
  {
    "source": "doge",
    "target": "palantir",
    "type": "political",
    "desc": "Pushed agencies to hire Palantir",
    "src": "NPR, Feb 2026",
    "url": "https://www.npr.org/2025/12/12/nx-s1-5631823/david-sacks-ai-advisor-investment-conflicts"
  },
  {
    "source": "dario",
    "target": "anthropic",
    "type": "cofounded",
    "desc": "CEO/Co-founder. Former OpenAI VP Research",
    "src": "Public record",
    "url": "https://www.anthropic.com/company"
  },
  {
    "source": "daniela",
    "target": "anthropic",
    "type": "cofounded",
    "desc": "President/Co-founder. Former OpenAI VP Ops",
    "src": "Public record",
    "url": "https://www.anthropic.com/company"
  },
  {
    "source": "amazon",
    "target": "anthropic",
    "type": "investment",
    "desc": "$8B. Primary cloud (AWS) and training (Trainium). $3.3B stock conversion gain. $11B Project Rainier",
    "src": "Anthropic; GeekWire",
    "url": "https://www.geekwire.com/2025/amazon-anthropic-investment/"
  },
  {
    "source": "google",
    "target": "anthropic",
    "type": "investment",
    "desc": "~10% early ($2B+). 1M TPU partnership (1+ GW)",
    "src": "CNBC; Wikipedia",
    "url": "https://en.wikipedia.org/wiki/Anthropic"
  },
  {
    "source": "microsoft",
    "target": "anthropic",
    "type": "investment",
    "desc": "$15B joint with Nvidia. $30B Azure/Nvidia compute commitment",
    "src": "CNBC, Nov 2025",
    "url": "https://www.cnbc.com/2025/11/22/anthropic-microsoft-nvidia-deal.html"
  },
  {
    "source": "nvidia",
    "target": "anthropic",
    "type": "investment",
    "desc": "$15B joint with Microsoft",
    "src": "CNBC, Nov 2025",
    "url": "https://www.cnbc.com/2025/11/22/anthropic-microsoft-nvidia-deal.html"
  },
  {
    "source": "ftx",
    "target": "anthropic",
    "type": "investment",
    "desc": "$500M stolen deposits. ~8%. Sold for $1.3B in bankruptcy",
    "src": "CNBC; The Block",
    "url": "https://www.cnbc.com/2024/03/25/ftx-estate-sells-majority-stake-in-startup-anthropic-for-884-million.html"
  },
  {
    "source": "sbf",
    "target": "ftx",
    "type": "cofounded",
    "desc": "CEO. Convicted fraud. 25 years",
    "src": "Public record",
    "url": "https://www.justice.gov/usao-sdny/pr/samuel-bankman-fried-sentenced-25-years-his-orchestration-multiple-fraudulent-schemes"
  },
  {
    "source": "mubadala",
    "target": "anthropic",
    "type": "investment",
    "desc": "Largest FTX buyer: $500M (16.6M shares)",
    "src": "CNBC, Mar 2024",
    "url": "https://www.cnbc.com/2024/03/25/ftx-estate-sells-majority-stake-in-startup-anthropic-for-884-million.html"
  },
  {
    "source": "janestreet",
    "target": "anthropic",
    "type": "investment",
    "desc": "~$100M FTX shares. Falls: $20M personal. Series F/G",
    "src": "CoinDesk; Unchained",
    "url": "https://www.coindesk.com/policy/2024/03/25/ftx-to-sell-884m-of-anthropic-shares-to-two-dozen-institutional-investors"
  },
  {
    "source": "founders_fund",
    "target": "anthropic",
    "type": "investment",
    "desc": "Co-led $30B Series G. Same fund: $1B in Anduril, Palantir investor",
    "src": "Anthropic, Feb 2026",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "gic",
    "target": "anthropic",
    "type": "investment",
    "desc": "Co-led Series F and G",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "coatue",
    "target": "anthropic",
    "type": "investment",
    "desc": "Co-led Series G with GIC",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "iconiq",
    "target": "anthropic",
    "type": "investment",
    "desc": "Led $13B Series F. Co-led G",
    "src": "Anthropic, Dec 2025",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "fidelity",
    "target": "anthropic",
    "type": "investment",
    "desc": "Co-led Series F. Bought $44M FTX shares",
    "src": "Goldman Sachs AM; CoinDesk",
    "url": "https://www.coindesk.com/policy/2024/03/25/ftx-to-sell-884m-of-anthropic-shares-to-two-dozen-institutional-investors"
  },
  {
    "source": "qia",
    "target": "anthropic",
    "type": "investment",
    "desc": "Series F and G",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "blackrock",
    "target": "anthropic",
    "type": "investment",
    "desc": "Series F and G. Largest asset manager",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "mgx",
    "target": "anthropic",
    "type": "investment",
    "desc": "Co-led Series G",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "sequoia",
    "target": "anthropic",
    "type": "investment",
    "desc": "Series F and G",
    "src": "Tracxn",
    "url": "https://tracxn.com/d/companies/anthropic/__yAHQSFE4GH5jmN0a0swKFYHx1x3cKU8VxxGCYG0iPBg"
  },
  {
    "source": "deshaw",
    "target": "anthropic",
    "type": "investment",
    "desc": "Co-led Series G. Bezos worked at D.E. Shaw before Amazon",
    "src": "Bloomberg, Feb 2026",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "temasek",
    "target": "anthropic",
    "type": "investment",
    "desc": "Series G. Also invested in Mithril (Thiel)",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "softbank",
    "target": "openai",
    "type": "investment",
    "desc": "$30B in $110B round. $500B Stargate project",
    "src": "Reuters, Feb 2026",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "amazon",
    "target": "openai",
    "type": "investment",
    "desc": "Up to $50B (Feb 2026). $100B AWS commitment. Primary cloud for both labs",
    "src": "CNBC, Feb 2026",
    "url": "https://www.cnbc.com/2026/02/04/amazon-to-invest-up-to-50-billion-in-openai.html"
  },
  {
    "source": "microsoft",
    "target": "openai",
    "type": "investment",
    "desc": "Largest investor",
    "src": "Public record",
    "url": "https://openai.com/index/openai-and-microsoft/"
  },
  {
    "source": "mgx",
    "target": "openai",
    "type": "investment",
    "desc": "Participated in $110B round",
    "src": "Reuters, Feb 2026",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "ltbt",
    "target": "anthropic",
    "type": "board",
    "desc": "Elects 2/6 directors (eventually majority). Trust Agreement unpublished",
    "src": "Anthropic; Harvard Law",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "shah",
    "target": "ltbt",
    "type": "board",
    "desc": "Chair. Clinton Health Access Initiative CEO",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "fontaine",
    "target": "ltbt",
    "type": "board",
    "desc": "Member. CNAS CEO. Former Defense Policy Board",
    "src": "Anthropic, Oct 2025",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "cuellar",
    "target": "ltbt",
    "type": "board",
    "desc": "Member. Carnegie president. Former CA Supreme Court",
    "src": "Anthropic, Jan 2026",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "matheny",
    "target": "ltbt",
    "type": "board",
    "desc": "Former member. RAND CEO. Recused Dec 2023",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "christiano",
    "target": "ltbt",
    "type": "board",
    "desc": "Former member. ARC founder. Left for US gov AI Safety",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "hastings",
    "target": "anthropic",
    "type": "board",
    "desc": "Board. Appointed by LTBT. Netflix co-founder",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "kreps",
    "target": "anthropic",
    "type": "board",
    "desc": "Board. Appointed by LTBT. Confluent co-founder",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "razavi",
    "target": "anthropic",
    "type": "board",
    "desc": "Board (investor). Spark Capital",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "palantir",
    "target": "anthropic",
    "type": "partnership",
    "desc": "Claude on classified networks via Palantir AIP (Impact Level 6). Used in Maduro operation. Dispute: Anthropic allegedly asked about Claude use in raid",
    "src": "Semafor; Axios; CNBC",
    "url": "https://www.pbs.org/newshour/world/ap-report-hegseth-warns-anthropic-to-let-the-military-use-companys-ai-tech-as-it-sees-fit"
  },
  {
    "source": "mithril",
    "target": "palantir",
    "type": "investment",
    "desc": "Thiel holds Palantir Class A and supervoting Class B through Mithril",
    "src": "Wikipedia (Mithril)",
    "url": "https://en.wikipedia.org/wiki/Mithril_Capital"
  },
  {
    "source": "founders_fund",
    "target": "palantir",
    "type": "investment",
    "desc": "Thiel holds Palantir through Founders Fund",
    "src": "Wikipedia (Mithril)",
    "url": "https://en.wikipedia.org/wiki/Mithril_Capital"
  },
  {
    "source": "founders_fund",
    "target": "spacex",
    "type": "investment",
    "desc": "Invested in SpaceX",
    "src": "Spokesman-Review",
    "url": "https://www.cnbc.com/2025/06/05/anduril-valuation-founders-fund.html"
  },
  {
    "source": "founders_fund",
    "target": "openai",
    "type": "investment",
    "desc": "Thiel invested in OpenAI via Founders Fund",
    "src": "Fortune, Nov 2023",
    "url": "https://fortune.com/2023/11/22/peter-thiel-founders-fund-openai-investment/"
  },
  {
    "source": "meta",
    "target": "eu_commission",
    "type": "lobbying",
    "desc": "~€10M/year. Top spender. Enforcement actions while lobbying for simplification",
    "src": "CEO/LobbyControl, Oct 2025",
    "url": "https://dig.watch/updates/big-tech-ramps-up-brussels-lobbying-as-eu-considers-easing-digital-rules"
  },
  {
    "source": "microsoft",
    "target": "eu_commission",
    "type": "lobbying",
    "desc": "€7M/year. With Google: removed discrimination from systemic risks",
    "src": "CEO, Apr 2025",
    "url": "https://corporateeurope.org/en/2023/11/big-techs-last-minute-blitz-further-diluting-ai-act-new-publication-shows-how"
  },
  {
    "source": "google",
    "target": "eu_commission",
    "type": "lobbying",
    "desc": "With Microsoft: reclassified discrimination from mandatory to optional",
    "src": "CEO, Apr 2025",
    "url": "https://corporateeurope.org/en/2023/11/big-techs-last-minute-blitz-further-diluting-ai-act-new-publication-shows-how"
  },
  {
    "source": "amazon",
    "target": "eu_commission",
    "type": "lobbying",
    "desc": "€4.2M increase (largest single)",
    "src": "Euronews, Oct 2025",
    "url": "https://dig.watch/updates/big-tech-ramps-up-brussels-lobbying-as-eu-considers-easing-digital-rules"
  },
  {
    "source": "apple",
    "target": "eu_commission",
    "type": "lobbying",
    "desc": "€7M/year. Top 10",
    "src": "CEO/LobbyControl, Oct 2025",
    "url": "https://dig.watch/updates/big-tech-ramps-up-brussels-lobbying-as-eu-considers-easing-digital-rules"
  },
  {
    "source": "ccias",
    "target": "eu_commission",
    "type": "lobbying",
    "desc": "Called for AI Act pause",
    "src": "Euronews, Oct 2025",
    "url": "https://dig.watch/updates/big-tech-ramps-up-brussels-lobbying-as-eu-considers-easing-digital-rules"
  },
  {
    "source": "salla",
    "target": "meta",
    "type": "employment",
    "desc": "Left Commission, Meta lobbyist within 3 months",
    "src": "CEO, Feb 2023",
    "url": "https://corporateeurope.org/en/2023/02/lobbying-ghost-machine"
  },
  {
    "source": "salla",
    "target": "eu_commission",
    "type": "employment",
    "desc": "Former Commission official",
    "src": "CEO, Feb 2023",
    "url": "https://corporateeurope.org/en/2023/02/lobbying-ghost-machine"
  },
  {
    "source": "cedric_o",
    "target": "mistral",
    "type": "employment",
    "desc": "Leads EU lobbying. Former Sec of State, Macron access",
    "src": "CEO, Nov 2023",
    "url": "https://corporateeurope.org/en/2023/11/big-tech-lobbying-derailing-ai-act"
  },
  {
    "source": "cedric_o",
    "target": "eu_commission",
    "type": "lobbying",
    "desc": "150-company letter. France opposed foundation model regulation",
    "src": "CEO, Nov 2023",
    "url": "https://corporateeurope.org/en/2023/11/big-tech-lobbying-derailing-ai-act"
  },
  {
    "source": "draghi",
    "target": "eu_commission",
    "type": "political",
    "desc": "Competitiveness report: GDPR/AI Act as innovation burdens",
    "src": "Euronews, Oct 2025",
    "url": "https://dig.watch/updates/big-tech-ramps-up-brussels-lobbying-as-eu-considers-easing-digital-rules"
  },
  {
    "source": "vance",
    "target": "eu_commission",
    "type": "political",
    "desc": "'In Europe free speech is in retreat' (Feb 2025)",
    "src": "Euronews, Oct 2025",
    "url": "https://dig.watch/updates/big-tech-ramps-up-brussels-lobbying-as-eu-considers-easing-digital-rules"
  },
  {
    "source": "rubio",
    "target": "eu_commission",
    "type": "political",
    "desc": "Instructed diplomats to undermine EU DSA (Aug 2025)",
    "src": "Euronews, Oct 2025",
    "url": "https://dig.watch/updates/big-tech-ramps-up-brussels-lobbying-as-eu-considers-easing-digital-rules"
  },
  {
    "source": "fontaine",
    "target": "cnas",
    "type": "employment",
    "desc": "CEO. Defense/national security think tank",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "cuellar",
    "target": "rand_corp",
    "type": "partnership",
    "desc": "Carnegie Endowment president (international affairs)",
    "src": "Anthropic, Jan 2026",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "matheny",
    "target": "rand_corp",
    "type": "employment",
    "desc": "CEO of RAND",
    "src": "Anthropic",
    "url": "https://www.anthropic.com/news"
  },
  {
    "source": "altman",
    "target": "openai",
    "type": "cofounded",
    "desc": "CEO",
    "src": "Public record",
    "url": "https://openai.com/about/"
  },
  {
    "source": "epi",
    "target": "doge",
    "type": "legal",
    "desc": "Estimated potential: $23.6B + $43.4B. Hypothetical, indicates scale",
    "src": "EPI, Feb 2025",
    "url": "https://www.epi.org/publication/doge-government-efficiency/"
  },
  {
    "source": "space_force",
    "target": "spacex",
    "type": "contract",
    "desc": "$845M Lane 2. PLEO $900M to $13B. 97% task orders",
    "src": "Built In; SpaceNews",
    "url": "https://builtin.com/articles/doge-tracker"
  }
];
