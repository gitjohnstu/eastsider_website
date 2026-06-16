import { prisma } from "@/lib/db";
import { toSlug } from "@/lib/utils";

interface SeedArticle {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  tags: string[];
  citySlug: string;
}

// ---------------------------------------------------------------------------
// Beacon, NY — Hudson Valley arts town on the Hudson River
// ---------------------------------------------------------------------------

const BEACON_ARTICLES: SeedArticle[] = [
  {
    title: "Dia:Beacon: A World-Class Museum on the Hudson",
    slug: "dia-beacon-museum-guide",
    excerpt:
      "Inside a former Nabisco box-printing factory, Dia:Beacon holds one of the most significant collections of minimalist and conceptual art in the world — and it belongs to a small Hudson Valley town.",
    body: `## The building is the first work of art

Before you even enter the galleries, Dia:Beacon announces its intentions. The former Nabisco printing factory — over 300,000 square feet of sawtooth skylights and polished concrete — was reimagined by artist Robert Irwin and OpenOffice architects to let natural light govern the experience. Every hour of the day, every season of the year, the light inside shifts. The art responds.

## What to expect from the collection

Dia:Beacon's permanent collection centers on artists of the 1960s and 70s who pushed art beyond the conventional object: Richard Serra's immense torqued steel ellipses that pull you off-balance as you walk through them, Dan Flavin's fluorescent light installations bathing entire rooms in cool or amber glow, Walter De Maria's massive geometric room installations you cannot fully comprehend at once.

The scale is the point. These works were made large deliberately — Dia is one of the only institutions in the world with the physical space to show them as intended.

## Plan your visit

Allow at least two to three hours. The museum closes on Tuesdays, and hours vary by season — check dia.art before you go. On weekdays outside summer, you may have entire galleries almost to yourself, which is the ideal way to encounter Serra's curves or Agnes Martin's quiet, lined paintings.

## Getting there from New York City

The Metro-North Hudson Line from Grand Central to Beacon Station runs hourly and takes just under 90 minutes. The museum is a 10-minute walk from the train. Many visitors combine Dia with lunch or dinner on Main Street — the pairing of serious art with a good meal has become a kind of ritual.

## After the museum

Walk toward the river. Beacon's Main Street is compact enough to explore on foot, and the waterfront park offers Hudson River views that feel genuinely earned after an afternoon in the galleries.`,
    coverImage:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=800&fit=crop",
    tags: ["museums", "arts", "day-trip"],
    citySlug: "beacon-ny",
  },
  {
    title: "Main Street Beacon: Your Dining Guide",
    slug: "beacon-main-street-dining-guide",
    excerpt:
      "Beacon's Main Street has evolved from a working-class strip into one of the Hudson Valley's most interesting restaurant corridors — without losing the character that made it worth visiting in the first place.",
    body: `## A street that grew up slowly

Main Street Beacon has never been precious about itself. Unlike some Hudson Valley destinations that feel curated to the point of self-consciousness, Beacon's main commercial stretch still mixes gallery cafes and farm-to-table spots with hardware stores and barbershops. That unevenness is exactly what makes it interesting.

The restaurant scene emerged gradually, pulled along by the art world that arrived with Dia:Beacon in 2003, and settled into something that now feels genuinely its own.

## The anchors

**Quinn's** is probably the most celebrated stop: a concert bar and restaurant with a serious beer list and a kitchen that treats bar food as a genuine culinary statement. If there's a show night, book early.

**Roundhouse at Beacon Falls** occupies a converted factory beside the Fishkill Creek and produces food that rewards the short detour from Main Street. The weekend brunch is a local institution.

**Garden Café & Market** anchors the vegetarian end of the spectrum without any of the earnest grimness that sometimes accompanies it. The food is genuinely good.

## Coffee and in-between stops

**Max's on Main** has long been a morning anchor — dependable espresso, street-level seating, and the kind of reliable regulars that tell you something is working.

**The Bank Square Coffeehouse** occupies a former bank vault and opens early enough to catch Metro-North commuters on their way to New York. The ceiling alone is worth the detour.

## Practical notes

Main Street is walkable in 20 minutes end to end. Parking is easier than you'd expect on weekday afternoons. Weekend afternoons in summer draw crowds — reservations for dinner are worth making at the higher-end spots.`,
    coverImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop",
    tags: ["restaurants", "dining-guide"],
    citySlug: "beacon-ny",
  },
  {
    title: "A Perfect Weekend in Beacon, New York",
    slug: "beacon-weekend-guide",
    excerpt:
      "Forty-five minutes north of New York City on Metro-North, Beacon rewards the visitor who slows down: a world-class art museum, a revived main street, Hudson River views, and a mountain trail above it all.",
    body: `## Friday evening: arrive and settle in

The 5:08 out of Grand Central drops you at Beacon Station in under 90 minutes. The walk into town takes 10 minutes on foot. If you've timed it right, Quinn's on Main Street has live music. If not, the bar is worth a visit regardless — the beer selection is serious and the kitchen stays open late.

## Saturday: the long day

Start at **Max's on Main** for coffee and something from the pastry case. Leave by 10am to beat the crowds at **Dia:Beacon**, which opens at 11. Plan for two to three hours inside; the Serra sculptures alone will take longer than you expect.

Lunch on Main Street after. Walk south toward the waterfront in the afternoon. The path along the Hudson offers unobstructed river views and, depending on the time of year, the kind of light that makes you understand why painters have been coming to this valley for 200 years.

Dinner at the **Roundhouse** — reserve ahead for a Saturday. The converted mill building beside Fishkill Creek is one of the better dinner settings in the Hudson Valley.

## Sunday: the mountain and the train home

If your legs are willing, the trail up **Mount Beacon** begins at the end of Howland Avenue. It's steep and rewards the effort with a view north and south down the Hudson that justifies the whole trip. Allow two hours round-trip.

Coffee on the way back down, brunch if the timing works, and the early afternoon train back. You'll arrive at Grand Central in time for the evening.

## What to know

- Beacon is compact and walkable — you won't need a car once you're here
- The town is busiest on summer weekends; shoulder seasons are quieter and still beautiful
- Dia:Beacon is closed Tuesdays; verify hours at dia.art
- Metro-North Hudson Line from Grand Central: roughly $18–22 round trip`,
    coverImage:
      "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1200&h=800&fit=crop",
    tags: ["weekend", "day-trip", "hudson-valley"],
    citySlug: "beacon-ny",
  },
  {
    title: "The Hudson Valley Table: Beacon's Farm-to-Fork Scene",
    slug: "beacon-farm-to-fork-dining",
    excerpt:
      "Beacon sits at the center of one of the most productive agricultural regions in the Northeast, and its restaurants have built something genuine around that proximity — not a trend, but a way of working.",
    body: `## The valley behind the plate

The Hudson Valley produces more than most people realize: dairy from Columbia County, orchard fruit from Ulster, vegetables from dozens of small farms spread between the Catskills and the river. Beacon restaurants, situated at the southern end of this corridor, have quietly built menus around that supply for years.

This isn't farm-to-table as performance. The chefs here mostly don't announce their sourcing on the menu. They just cook what arrives that week.

## Where to eat

**Roundhouse at Beacon Falls** changes its menu with genuine fidelity to the seasons. By November the kitchen is doing root vegetables in ways that make summer dishes feel like a distant memory. The wine list trends toward natural producers, mostly European, occasionally from New York.

**Quinn's** applies the same localism to bar food and makes it work. The burger uses beef from a farm 40 minutes north. It matters.

**Garden Café & Market** has run a vegetarian kitchen since before it was fashionable, sourcing produce directly from farms up-valley and building dishes that don't treat meat absence as the point.

## The farmers market

The Beacon Farmers Market runs on Sundays from mid-spring through fall in the parking lot near the train station. For visitors arriving on a Sunday morning, it's worth arriving an hour early and walking the stalls before heading to Dia or up the mountain. The stone fruit in August is exceptional.

## A note on scale

Beacon's restaurant scene is small enough that word travels fast when something is good — and fast when it isn't. The places that have survived have earned their clientele. There's no hype machine here, just a steady stream of people who know where they're going.`,
    coverImage:
      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1200&h=800&fit=crop",
    tags: ["restaurants", "farm-to-table", "hudson-valley"],
    citySlug: "beacon-ny",
  },
];

// ---------------------------------------------------------------------------
// Whiteface, NY — Adirondack mountain life near Lake Placid
// ---------------------------------------------------------------------------

const WHITEFACE_ARTICLES: SeedArticle[] = [
  {
    title: "Skiing Whiteface Mountain: What You Need to Know",
    slug: "whiteface-mountain-ski-guide",
    excerpt:
      "Whiteface has the greatest vertical drop east of the Rockies, a legitimate Olympic pedigree, and terrain that rewards skiers willing to work for their turns. Here's how to make the most of a day on the mountain.",
    body: `## The numbers that matter

Whiteface Mountain rises 3,430 feet above sea level. Its vertical drop of 3,166 feet is the largest in the eastern United States. This isn't a marketing claim — it shapes the entire experience. Runs that would be classified as long at other eastern mountains become here just the upper half of a top-to-bottom descent.

The mountain hosted alpine skiing events in the 1980 Lake Placid Winter Olympics, and the race courses are still in use today. The Cloudsplitter Gondola reaches the summit on clear days to a 360-degree view that takes in the Adirondack High Peaks, Lake Placid, and on exceptionally clear mornings, the outline of the Green Mountains in Vermont.

## The terrain breakdown

Whiteface has 90 trails spread across four distinct peaks. The upper mountain, accessed by the gondola or the Cloudsplitter chair, holds most of the advanced terrain — sustained steep pitches that don't relent until the base lodge. The intermediate terrain runs the length of the mountain in wide, cruising lanes that reward speed.

The Wilmington side of the mountain gets less traffic and repays the skier willing to explore. On powder days, it holds snow longer than the main face.

## When to go

January through mid-March typically offers the best snow conditions. Whiteface snowmaking infrastructure is among the most extensive in the East — the mountain maintains over 95% of its terrain with snowmaking — but natural snow transforms the experience. Watch the weather a week out; northwesterly systems dump reliably on the Adirondacks.

## Practical notes

- Summit elevation: 4,867 feet (highest skiable peak in the Northeast)
- 3,166 feet vertical, 90 trails, 11 lifts
- Gondola to summit: runs weather permitting
- Lake Placid, 8 miles south, has the full range of lodging and après options
- Ski and boot rentals available at the mountain base lodge`,
    coverImage:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=800&fit=crop",
    tags: ["ski", "mountain", "winter"],
    citySlug: "whiteface-ny",
  },
  {
    title: "Lake Placid Dining: Where to Eat Near Whiteface",
    slug: "lake-placid-dining-guide",
    excerpt:
      "Lake Placid's restaurant scene has grown well beyond ski-town basics. Eight miles from Whiteface, the village holds a handful of genuinely good kitchens worth planning your day around.",
    body: `## After the mountain

Lake Placid village sits in a bowl between Mirror Lake and Lake Placid itself, bookended by the Olympic complex and a main street that has somehow managed to be simultaneously touristy and functional. The restaurants have benefited from a discerning year-round local population that keeps the better places honest.

## Dinner worth planning around

**Generations at the Mirror Lake Inn** is the most formally composed dining room in the region — the kind of place that makes you dress slightly better than you planned. The kitchen does modern American with genuine technique, and the wine list is serious. Reserve ahead.

**Wylder Bistro** sits on Main Street and runs a menu that changes often enough to keep locals returning. The execution is clean, the portions generous, and the atmosphere doesn't take itself too seriously. Good for a post-ski dinner when you want real food without ceremony.

**Big Slide Brewery & Public House** anchors the casual end of the spectrum with house-brewed beers and a kitchen that respects its ingredients. The burger is among the best in the region.

## Morning fuel

**Mud Puddle Coffee** opens early and makes a case that you don't need to sacrifice quality for convenience at 7am before ski boots go on.

**Lisa G's** has served breakfast to generations of Adirondack visitors and locals alike. The pancakes are the correct choice. There will be a line on weekends; it moves.

## Practical notes

Lake Placid is a 15-minute drive from Whiteface Mountain base lodge. The village is compact — most restaurants are within a 5-minute walk of Mirror Lake. Parking in winter is manageable on weekdays; plan extra time on busy weekend evenings.`,
    coverImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&fit=crop",
    tags: ["restaurants", "dining-guide", "lake-placid"],
    citySlug: "whiteface-ny",
  },
  {
    title: "Summer on Whiteface: Hiking, Gondola Rides & Alpine Pursuits",
    slug: "whiteface-summer-activities-guide",
    excerpt:
      "The mountain doesn't close when the snow melts. Summer on Whiteface offers gondola rides to the summit, hiking trails through old-growth forest, and a quieter, more intimate version of the Adirondacks.",
    body: `## The mountain in summer

Without snow, Whiteface reveals its bones. The ski trails become hiking paths lined with wildflowers; the summit, accessible by gondola from late spring through October, offers the same commanding view that skiers get on clear winter days — and without goggles.

The Cloudsplitter Gondola runs through the summer season and drops you at the summit in under 20 minutes. From there you can walk the short ridge trail or simply stay at the top and watch weather systems build over the High Peaks to the south.

## Hiking options

**The Whiteface Memorial Highway** is the only road in New York State that leads to a High Peak — Whiteface summit at 4,867 feet. The highway is open to cyclists and walkers as well as vehicles, and the climb rewards the effort.

For hikers who prefer trail to road, the approach from the Atmospheric Sciences Research Center is steeper and longer but keeps you in the forest. The summit register has signatures going back decades.

**Wilmington Notch Campground** sits at the base of the mountain pass and provides access to a network of trails that most visitors never find. The swimming hole in the Ausable River below the notch is a summer fixture for locals.

## After the mountain

Lake Placid's Olympic venues operate year-round. The **Olympic Jumping Complex** offers sightseeing rides on the ski jump elevators that give the same view from 120 meters that competitors get before launch. The **Olympic Oval** is open for inline skating in summer. The **Olympic Museum** on Main Street gives the full history of Lake Placid's two Games.

## Practical notes

- Gondola operates late spring through mid-October; check whiteface.com for dates
- Summer weekends bring hikers and day-trippers from the greater Northeast; weekdays are quieter
- The Ausable River offers fly fishing; guides can be arranged through Lake Placid outfitters
- Mosquitoes peak in June; bring repellent for trail hiking before mid-July`,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop",
    tags: ["hiking", "summer", "mountain", "outdoor"],
    citySlug: "whiteface-ny",
  },
  {
    title: "The Olympic Legacy of Lake Placid",
    slug: "lake-placid-olympic-legacy",
    excerpt:
      "Lake Placid hosted the Winter Olympics twice — in 1932 and 1980 — and the infrastructure those Games left behind shapes everything about life in the village today, from the bobsled track still running tourists down its curves to the speed skating oval where Eric Heiden won five golds.",
    body: `## Twice in a century

Few places in the world have hosted the Winter Olympics once. Lake Placid has done it twice, separated by nearly 50 years. The first Games in 1932 were held during the Depression, a testament to a community's conviction in its own landscape. The second, in 1980, became one of the most-watched moments in American sports history.

The village has lived with that legacy ever since — and largely thrived because of it. The venues still function. The athletes still train here. The infrastructure built for competition remains available to the public in ways that have no equivalent elsewhere in the United States.

## The Miracle on Ice

On February 22, 1980, the United States men's ice hockey team defeated the Soviet Union in a semifinal game that the country watched in real time and has mythologized ever since. The Soviet team had won the gold medal in six of the previous seven Olympics. The American team was composed of college players. The final score was 4–3.

The game was played at the Olympic Center on Main Street, which still stands. You can walk into the arena today. The ice is the same, the boards are the same vintage, and if you look up, the scoreboard tells you where you are.

## What's still operating

The **Olympic Museum** on Main Street holds the full archive — equipment, medals, film footage, oral histories from athletes who were there. The 1980 hockey game gets its own room.

The **Olympic Oval** hosts speed skating events in winter and is open to public skaters on scheduled sessions. The **Olympic Jumping Complex** north of the village offers chairlift and elevator rides to the top of the 120-meter jump.

The **Mount Van Hoevenberg Sliding Center** runs the only public bobsled experience in North America — a real bobsled run on real Olympic ice with trained brakemen. The season depends on conditions; check the calendar at whiteface.com.

## A small town with a large footprint

Lake Placid village proper has fewer than 2,500 year-round residents. The Olympic infrastructure it maintains is scaled for an event that draws thousands. The result is a place that operates at an unusual register — intimate in character, outsized in ambition, and genuinely proud of what happened here.`,
    coverImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop",
    tags: ["history", "olympics", "lake-placid", "culture"],
    citySlug: "whiteface-ny",
  },
];

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function seedArticles(articles: SeedArticle[]): Promise<number> {
  let count = 0;

  for (const article of articles) {
    const tagRecords = await Promise.all(
      article.tags.map(async (tagName) => {
        const slug = toSlug(tagName);
        return prisma.tag.upsert({
          where: { slug },
          create: { name: tagName, slug },
          update: {},
        });
      }),
    );

    await prisma.article.upsert({
      where: { slug: article.slug },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body: article.body,
        coverImage: article.coverImage,
        citySlug: article.citySlug,
        status: "PUBLISHED",
        publishedAt: new Date(),
        tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
      },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        coverImage: article.coverImage,
        citySlug: article.citySlug,
        status: "PUBLISHED",
        tags: { set: tagRecords.map((t) => ({ id: t.id })) },
      },
    });

    count++;
  }

  return count;
}

export async function seedBeaconArticles(): Promise<number> {
  return seedArticles(BEACON_ARTICLES);
}

export async function seedWhitefaceArticles(): Promise<number> {
  return seedArticles(WHITEFACE_ARTICLES);
}
