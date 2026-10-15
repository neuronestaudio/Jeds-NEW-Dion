/**
 * JED's real Google reviews, copied from the Google Business Profile
 * ("Jed Air Conditioning", 4.8 from 23 reviews when last checked on the
 * date below). The homepage reviews strip renders these; nothing on the
 * site is invented.
 *
 * Of the 23: twenty-one are 5 stars, one is lower than 5 with no text
 * (Lorainne Gray), one is 2 stars (Sunny Wu, kept here so the data is
 * honest, filtered out of the strip below). Three 5-star reviews carry no
 * text (Janice Su, Thanh Long Nguyen, Lorainne Gray) and so have no card.
 *
 * Refresh: open `mapsUrl`, sort by newest, copy new reviews in at the top,
 * update `rating`, `count` and `checked`. `when` is written as a month or
 * year rather than Google's "3 days ago" so the page never goes stale.
 */

export const GOOGLE_PROFILE = {
  name: 'Jed Air Conditioning',
  rating: 4.8,
  count: 23,
  /** The listing. The CID form is stable; share links are not. */
  mapsUrl: 'https://www.google.com/maps/place/?cid=15284943100637322560',
  /** The Business Profile's own 'Get more reviews' link: opens the review form. */
  reviewUrl: 'https://g.page/r/CUCdi1XEBh_UEB0/review',
  checked: '2026-10-15',
} as const;

export interface Review {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** When it was left, as a month or year. */
  when: string;
  text: string;
}

export const REVIEWS: Review[] = [
  {
    name: 'David Hickling',
    rating: 5,
    when: 'October 2026',
    text: 'I would highly recommend Jed Air Conditioning. We had a split system installed in Croydon and they were super organised and let us know exactly when they would arrive. They had it all up and running and cleaned up within the day. Excellent price too.',
  },
  {
    name: 'Michael Papalardo',
    rating: 5,
    when: 'October 2026',
    text: 'Anthony from Jed Air Conditioning is fantastic to deal with. He is professional, responsive, and quick to get back to you. I would highly recommend Anthony and his team. Thank you for the quick turnaround and excellent service.',
  },
  {
    name: 'Kate Henderson',
    rating: 5,
    when: 'October 2026',
    text: 'Anthony & his team were super efficient. Great communication & prompt service. Much better than other AC companies we contacted.',
  },
  {
    name: 'Isabella Abbattista',
    rating: 5,
    when: 'October 2026',
    text: 'Very great job, perfect installation.',
  },
  {
    name: 'Charles',
    rating: 5,
    when: 'October 2026',
    text: 'Very friendly, professional and on time. They say, they deliver with exceptional outcome and expectations. Thank you guys.',
  },
  {
    name: 'Jeff Wang',
    rating: 5,
    when: 'October 2026',
    text: 'Fantastic experience from start to finish. Anthony and the team was very professional, got our Daikin ducted system installed very quickly. Quality of the work is great and at a great price. Highly recommend.',
  },
  {
    name: 'Selena Afeaki',
    rating: 5,
    when: 'October 2026',
    text: 'Honest, straight up and experienced with difficult problems. Fixed my system with simple hard work when others wanted to do expensive full replacements. So will gladly ask to service and maintain ongoing. Reliable and fast too.',
  },
  {
    name: 'Sam & Tiff Langford',
    rating: 5,
    when: 'September 2026',
    text: 'Anthony and his team installed ducted air conditioning throughout our house. He carefully looked at floor plans and suggested 6 zones to ensure efficient cooling/heating and maximum airflow. He answered all questions clearly and was transparent with pricing. On the day of installation, the team arrived on time and worked quickly to ensure the job was done within a day. They even removed the old split system for us. Everything was explained clearly to me and we’re super happy with their work. Thanks Anthony and the team at JED Air Conditioning!',
  },
  {
    name: 'Andrew Lim',
    rating: 5,
    when: 'September 2026',
    text: 'The team did a great job installing our AC unit at my home. They took great care and were very professional. Anthony also took the time to visit my property again when I had questions and has been super responsive on text after the install. Would highly recommend if you’re looking for a professional team who is very knowledgeable and knows what they are doing.',
  },
  {
    name: 'Nikolina Desanti',
    rating: 5,
    when: 'September 2026',
    text: 'Anthony did a service on my ducted AC. Great service and communication. 10/10.',
  },
  {
    name: 'Graeme Shaw',
    rating: 5,
    when: 'September 2026',
    text: 'Anthony and his team are first rate. I own a mid-tier construction company focused on quality builds in Sydney’s eastern suburbs and feel qualified to rate these guys extremely highly. Professional, courteous, prompt and reliable technicians.',
  },
  {
    name: 'William Vuong',
    rating: 5,
    when: 'July 2026',
    text: 'Amazing and excellent service from Anthony and his team. They were prompt, arrived on time and answered all my concerns and questions before starting the job. Everything went to plan with no hiccups. He gave ideas and recommendations which we took and we did not regret them at all. Thanks Jed Air Conditioning!',
  },
  {
    name: 'NowYouSeeMe',
    rating: 5,
    when: '2025',
    text: 'Installed our aircon a few years back — did great work!',
  },
  {
    name: 'Sunny Wu',
    rating: 2,
    when: '2025',
    text: 'I had several issues with the air conditioners that this business installed in my house less than a year ago. Although it is still within the warranty period, the installer responded to my reported issues very slowly, and fixed one problem but caused a few more new problems. I had to engage another certified aircon installer for repairs work.',
  },
  {
    name: 'Damien Tang',
    rating: 5,
    when: '2024',
    text: 'Anthony runs a fantastic and honest business. He provided a cost effective solution for balancing my ducted air-conditioning at home. He also gave me advice on how to plan for future zones within my home. His honesty and timely work is highly recommended by me.',
  },
  {
    name: 'Adam Foster',
    rating: 5,
    when: '2024',
    text: 'Anthony is an honest, friendly, quality technician. Came out on an emergency call to fix my ducted system which was leaking in the roof due to a faulty installation from builder. Would highly recommend contacting Jed Air Conditioning for any service, repair or installations. I won’t be calling anyone else from now on.',
  },
  {
    name: 'Xuan-Truong Phillips Nguyen',
    rating: 5,
    when: '2023',
    text: 'Loving our new ducted system installed by JED Air Conditioning. Fully installed within a day and it looks great! Their work is quality at a reasonable price. I would highly recommend Anthony and his team for anyone looking for a professional and prompt service. Thanks again.',
  },
  {
    name: 'Christie Nguyen',
    rating: 5,
    when: '2023',
    text: 'Anthony and his team were amazing! They were able to install our whole house ducted air conditioning in one day and we couldn’t be happier with it. Excellent price, efficient service and great job!',
  },
  {
    name: 'Ann Nguyen',
    rating: 5,
    when: '2023',
    text: 'I cannot recommend Anthony and his team enough. I had contacted him to install a split system in my investment property. He was able to inspect and install quicker than I expected. His price was competitive. Please be reassured that you are in good hands if you are using him.',
  },
];

/** What the site shows: 4 stars and up, newest first. */
export const DISPLAYED_REVIEWS = REVIEWS.filter((r) => r.rating >= 4);
