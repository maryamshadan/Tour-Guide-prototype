
import { Monument, SafetyLevel, POI, Badge } from './types';

export const MONUMENTS: Monument[] = [
  {
    id: '1',
    name: 'Charminar',
    type: 'Monument',
    description: 'The global icon of Hyderabad, standing as a symbol of the city’s rich heritage. This square-shaped structure features four grand arches and four exquisite minarets that soar 56 meters into the sky, overlooking the bustling Laad Bazaar.',
    history: 'Constructed in 1591 by Sultan Muhammad Quli Qutb Shah, the fifth ruler of the Qutb Shahi dynasty. It was built to commemorate the end of a deadly plague that had ravaged the city. Legend says a secret tunnel connects it to Golconda Fort for the royal family\'s escape during distress.',
    lat: 17.3616,
    lon: 78.4747,
    safetyScore: 60,
    safetyLevel: SafetyLevel.CAUTION,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/640px-Charminar_Hyderabad_1.jpg'
  },
  {
    id: '2',
    name: 'Golconda Fort',
    type: 'Fort',
    description: 'A majestic citadel famous for its sophisticated acoustic system, where a hand clap at the entrance can be heard at the hilltop pavilion. The complex includes mosques, temples, granaries, and royal chambers atop a 120-meter high granite hill.',
    history: 'Originally a mud fort built by the Kakatiyas, it was expanded by the Qutb Shahi sultans into a massive granite fortification. It was the capital of the medieval sultanate and a center for the diamond trade, famously associated with the Koh-i-Noor and Hope diamonds.',
    lat: 17.3833,
    lon: 78.4011,
    safetyScore: 85,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Golconda_Fort_01.jpg/640px-Golconda_Fort_01.jpg'
  },
  {
    id: '3',
    name: 'Qutb Shahi Tombs',
    type: 'Tombs',
    description: 'A serene necropolis containing the tombs of the seven Qutb Shahi rulers. These majestic domed structures are set amidst landscaped gardens (Ibrahim Bagh) and represent a unique architectural blend of Persian, Pashtun, and Hindu styles.',
    history: 'Built during the reign of the Qutb Shahi dynasty (16th–17th centuries), these are among the few necropolises in the world where an entire dynasty is buried in one place. The tombs were planned and built by the kings themselves during their lifetimes.',
    lat: 17.3966,
    lon: 78.3966,
    safetyScore: 80,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Qutb_Shahi_Tombs%2C_Hyderabad.jpg/640px-Qutb_Shahi_Tombs%2C_Hyderabad.jpg'
  },
  {
    id: '4',
    name: 'Chowmahalla Palace',
    type: 'Palace',
    description: 'A magnificent palace complex that served as the official residence of the Nizams of Hyderabad. It features four palaces (Chow-Mahalla), intricate clock towers, and the grand Khilwat Mubarak (Durbar Hall) with spectacular crystal chandeliers.',
    history: 'Construction began in 1750 by Salabat Jung and was completed by Nizam Afzal-ud-Dawlah in 1869. Modeled after the Shah of Iran\'s palace in Tehran, it hosted grand durbars and royal ceremonies for the Asaf Jahi dynasty for over a century.',
    lat: 17.3578,
    lon: 78.4717,
    safetyScore: 95,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Chowmahalla_Palace_2023.jpg/640px-Chowmahalla_Palace_2023.jpg'
  },
  {
    id: '5',
    name: 'Falaknuma Palace',
    type: 'Palace',
    description: 'Known as the "Mirror of the Sky," this scorpion-shaped palace is perched 2,000 feet above Hyderabad. It is renowned for its Italian marble staircases, Venetian chandeliers, and the 101-seat dining table, one of the largest in the world.',
    history: 'Built by Nawab Vikar-ul-Umra, the Prime Minister of Hyderabad, in 1893, it was later purchased by the 6th Nizam, Mahboob Ali Khan. It served as a royal guest house for dignitaries like King George V and Czar Nicholas II before becoming a luxury hotel.',
    lat: 17.3312,
    lon: 78.4672,
    safetyScore: 99,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Taj_Falaknuma_Palace_Hyderabad.jpg/640px-Taj_Falaknuma_Palace_Hyderabad.jpg'
  },
  {
    id: '6',
    name: 'Birla Mandir',
    type: 'Temple',
    description: 'A gleaming white Hindu temple dedicated to Lord Venkateswara, built entirely of 2000 tons of pure Rajasthani white marble. Located on the Naubat Pahad hill, it offers panoramic views of Hyderabad and Hussain Sagar Lake.',
    history: 'Construction took ten years and was completed in 1976 by the Birla Foundation. The temple blends Dravidian, Rajasthani, and Utkala architectural styles. Swami Ranganathananda of Ramakrishna Mission inaugurated it as a place for meditation with no bells.',
    lat: 17.4062,
    lon: 78.4691,
    safetyScore: 95,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Birla_Mandir_Hyderabad.jpg/640px-Birla_Mandir_Hyderabad.jpg'
  },
  {
    id: '7',
    name: 'Mecca Masjid',
    type: 'Mosque',
    description: 'One of the oldest and largest mosques in India, capable of accommodating 10,000 worshippers. The main hall is 75 feet high, 220 feet wide, and 180 feet long, creating a profound sense of spiritual grandeur.',
    history: 'Commissioned by Muhammad Quli Qutb Shah in 1617, the mosque\'s central arch was built using bricks made from soil brought specifically from Mecca, Saudi Arabia. The construction was completed by the Mughal Emperor Aurangzeb in 1694 after he conquered Hyderabad.',
    lat: 17.3603,
    lon: 78.4736,
    safetyScore: 65,
    safetyLevel: SafetyLevel.CAUTION,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Mecca_Masjid_Hyderabad.jpg/640px-Mecca_Masjid_Hyderabad.jpg'
  },
  {
    id: '8',
    name: 'Ramappa Temple',
    type: 'Temple',
    description: 'A UNESCO World Heritage Site, this Shiva temple is a marvel of Kakatiyan engineering. It is famous for its "floating bricks," intricate carvings of dancers that inspired Jayapa Senani’s dance treatise, and the sandbox technology used in its foundation.',
    history: 'Built in 1213 AD by Recharla Rudra, a general of Kakatiya King Ganapati Deva. It is arguably the only temple in India named after its sculptor, Ramappa, rather than the presiding deity. The structure has withstood centuries of earthquakes due to its unique foundation.',
    lat: 18.2589,
    lon: 79.9432,
    safetyScore: 92,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ramappa_Temple_Front_View.jpg/640px-Ramappa_Temple_Front_View.jpg'
  },
  {
    id: '9',
    name: 'Warangal Fort',
    type: 'Fort',
    description: 'The ruins of a once-impregnable fortress featuring four massive ornamental stone gateways known as Kakatiya Kala Thoranam. The site showcases the architectural prowess of the Kakatiya dynasty with intricate stone carvings and varying layers of fortification.',
    history: 'Construction began in the 12th century under King Ganapati Deva and was completed by his daughter, Rani Rudrama Devi. It was the capital of the Kakatiya kingdom until its fall to the Delhi Sultanate in 1323, leading to the destruction of much of the fort.',
    lat: 17.9576,
    lon: 79.6052,
    safetyScore: 75,
    safetyLevel: SafetyLevel.CAUTION,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Warangal_Fort_Ruins.jpg/640px-Warangal_Fort_Ruins.jpg'
  },
  {
    id: '10',
    name: 'Yadadri Temple',
    type: 'Temple',
    description: 'A grand Hindu temple situated on a hillock, dedicated to Lord Narasimha Swamy. The newly renovated complex is built entirely of black granite (Krushna Sila) and features spectacular sculptures, gopurams, and a golden vimana.',
    history: 'Ancient scriptures mention this as the abode where Lord Narasimha appeared in five forms for Sage Yadarishi. The temple recently underwent a massive reconstruction by the Telangana government, transforming it into one of the largest temple complexes in India.',
    lat: 17.5886,
    lon: 78.9432,
    safetyScore: 98,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Yadagirigutta_Temple.jpg/640px-Yadagirigutta_Temple.jpg'
  },
  {
    id: '11',
    name: 'Bhadrachalam Temple',
    type: 'Temple',
    description: 'Located on the banks of the Godavari River, this is one of the most significant Rama temples in India, often called the "Ayodhya of the South." The temple complex is known for its vibrant spiritual atmosphere and beautiful carvings.',
    history: 'Built in the 17th century by Kancherla Gopanna (Bhakta Ramadas), a revenue official who used tax money for construction and was imprisoned by the Tanishah of Golconda. Legend says Lord Rama and Lakshmana repaid the money to the king to secure his release.',
    lat: 17.6688,
    lon: 80.8936,
    safetyScore: 90,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bhadrachalam_Temple.jpg/640px-Bhadrachalam_Temple.jpg'
  },
  {
    id: '12',
    name: 'Salar Jung Museum',
    type: 'Museum',
    description: 'One of the largest one-man collections of antiques in the world. The museum houses over a million objects, including the famous Veiled Rebecca statue, the Musical Clock, and a vast collection of manuscripts, weapons, and carpets.',
    history: 'Established in 1951, the collection belonged to the Salar Jung family, primarily Salar Jung III (Mir Yousuf Ali Khan), who served as Prime Minister to the Nizam. He dedicated his entire life and fortune to collecting artifacts from across the globe.',
    lat: 17.3714,
    lon: 78.4804,
    safetyScore: 98,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Salar_Jung_Museum_Hyderabad.jpg/640px-Salar_Jung_Museum_Hyderabad.jpg'
  },
  {
    id: '13',
    name: 'Thousand Pillar Temple',
    type: 'Temple',
    description: 'A masterpiece of Kakatiya architecture located in Hanamkonda. The star-shaped temple is dedicated to Shiva, Vishnu, and Surya, supported by 1,000 richly carved pillars that are arranged so that none obstruct the view of the deity.',
    history: 'Built in 1163 AD by King Rudra Deva. It serves as a classic example of the Kakatiya style of architecture, characterized by intricate stone sculpture and the use of sandbox foundations. It was desecrated by the Tughlaq dynasty but remains a vital heritage site.',
    lat: 18.0030,
    lon: 79.5744,
    safetyScore: 88,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Thousand_Pillar_Temple.jpg/640px-Thousand_Pillar_Temple.jpg'
  },
  {
    id: '14',
    name: 'Pakhal Lake',
    type: 'Nature',
    description: 'A serene man-made lake situated amidst the Pakhal Wildlife Sanctuary. It offers a picturesque retreat with lush forests surrounding the waters, providing a habitat for leopards, panthers, and bears.',
    history: 'This artificial lake was excavated in 1213 AD by the Kakatiya King Ganapati Deva to serve as an irrigation source. It stands as a testimony to the advanced hydraulic engineering skills of the Kakatiya era.',
    lat: 17.9536,
    lon: 79.9906,
    safetyScore: 50,
    safetyLevel: SafetyLevel.CAUTION,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Pakhal_Lake_Warangal.jpg/640px-Pakhal_Lake_Warangal.jpg'
  },
  {
    id: '15',
    name: 'Kondapalli Fort',
    type: 'Fort',
    description: 'A massive hill fortress near Vijayawada (bordering Telangana/Andhra), known for its scenic views and the nearby village famous for crafting "Kondapalli toys" from soft wood. The fort features three successive entry gates and a royal palace.',
    history: 'Built by Prolaya Vema Reddy in the 14th century, it later passed into the hands of the Gajapatis of Odisha and then the Qutb Shahis. It served as a military training base and a strategic defense point for centuries.',
    lat: 16.6167,
    lon: 80.5333,
    safetyScore: 70,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Kondapalli_Fort_Entry_Gate.jpg/640px-Kondapalli_Fort_Entry_Gate.jpg'
  },
  {
    id: '16',
    name: 'Paigah Tombs',
    type: 'Tombs',
    description: 'The final resting place of the Paigah nobility, who were high-ranking aristocrats in the Nizam\'s court. The tombs are celebrated for their unique lime and mortar craftsmanship, featuring intricate trellis work and geometric patterns.',
    history: 'Constructed in the late 18th century, the Paigahs were arguably the most powerful family in Hyderabad after the Nizams. These tombs display a distinct architectural style that blends Mughal, Greek, Persian, Asaf Jahi, and Rajasthani motifs.',
    lat: 17.3457,
    lon: 78.5053,
    safetyScore: 75,
    safetyLevel: SafetyLevel.CAUTION,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Paigah_Tombs_Corridor.jpg/640px-Paigah_Tombs_Corridor.jpg'
  },
  {
    id: '17',
    name: 'Jagannath Temple',
    type: 'Temple',
    description: 'A modern architectural marvel located in Banjara Hills, built as a replica of the famous Puri Jagannath Temple. The temple is constructed using reddish sandstone and features 600-foot high shikhara with intricate carvings.',
    history: 'Constructed by the Kalinga Cultural Trust and consecrated in 2009. It serves as a cultural hub for the Odia community in Hyderabad and is known for its annual Ratha Yatra festival, mirroring the traditions of Puri.',
    lat: 17.4139,
    lon: 78.4419,
    safetyScore: 95,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Jagannath_Temple_Hyderabad.jpg/640px-Jagannath_Temple_Hyderabad.jpg'
  },
  {
    id: '18',
    name: 'Bhadrakali Temple',
    type: 'Temple',
    description: 'One of the oldest temples dedicated to Goddess Bhadrakali, located on a hilltop between Hanamkonda and Warangal. The deity is depicted with fierce eyes and eight arms, wielding weapons, carved out of a single stone.',
    history: 'Originally built in 625 AD by King Pulakeshin II of the Chalukya dynasty to commemorate his victory over the Vengi region. It was later adopted and worshipped by the Kakatiya kings, who considered Goddess Bhadrakali their kuladevata (clan deity).',
    lat: 17.9964,
    lon: 79.5713,
    safetyScore: 88,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Bhadrakali_Temple_Warangal.jpg/640px-Bhadrakali_Temple_Warangal.jpg'
  },
  {
    id: '19',
    name: 'Nizams Museum',
    type: 'Museum',
    description: 'Located in the Purani Haveli, this museum displays the personal gifts and mementos received by the last Nizam, Osman Ali Khan. Highlights include a golden tiffin box studded with diamonds and a 150-year-old manual lift.',
    history: 'The museum was opened to the public in 2000. It is housed in the Purani Haveli, which was the residence of the second Nizam. The collection offers an intimate glimpse into the opulent lifestyle of the dynasty that was once the richest in the world.',
    lat: 17.3655,
    lon: 78.4811,
    safetyScore: 90,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Nizam_Museum_Hyderabad.jpg/640px-Nizam_Museum_Hyderabad.jpg'
  },
  {
    id: '20',
    name: 'Kondagattu Anjaneya Swamy',
    type: 'Temple',
    description: 'A revered shrine dedicated to Lord Hanuman, situated amidst hills and hillocks in Jagtial district. It is believed that visiting this temple brings relief to those suffering from mental and physical ailments.',
    history: 'According to folklore, the temple was built by a cowherd about 400 years ago after Lord Hanuman appeared in his dream. The idol is unique as it features two faces (Narasimha and Hanuman), making it a powerful site for devotees.',
    lat: 18.6433,
    lon: 78.9038,
    safetyScore: 85,
    safetyLevel: SafetyLevel.SAFE,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Kondagattu_Temple_Entrance.jpg/640px-Kondagattu_Temple_Entrance.jpg'
  }
];

export const POIS: POI[] = [
    // --- HYDERABAD HOTELS ---
    { id: 'h_hyd_1', name: 'Taj Falaknuma Palace', type: 'HOTEL', lat: 17.3312, lon: 78.4672, rating: 5.0, address: 'Engine Bowli, Falaknuma, Hyderabad' },
    { id: 'h_hyd_2', name: 'ITC Kakatiya', type: 'HOTEL', lat: 17.4326, lon: 78.4608, rating: 4.8, address: 'Begumpet, Hyderabad' },
    { id: 'h_hyd_3', name: 'Park Hyatt', type: 'HOTEL', lat: 17.4246, lon: 78.4284, rating: 4.9, address: 'Banjara Hills, Hyderabad' },
    { id: 'h_hyd_4', name: 'Hotel Shadab', type: 'HOTEL', lat: 17.3668, lon: 78.4756, rating: 4.1, address: 'Near Charminar, Hyderabad' },
    { id: 'h_hyd_5', name: 'Trident Hotel', type: 'HOTEL', lat: 17.4485, lon: 78.3725, rating: 4.7, address: 'Hitech City, Hyderabad' },
    { id: 'h_hyd_6', name: 'Taj Krishna', type: 'HOTEL', lat: 17.4162, lon: 78.4499, rating: 4.8, address: 'Banjara Hills, Hyderabad' },
    { id: 'h_hyd_7', name: 'Novotel Airport', type: 'HOTEL', lat: 17.2308, lon: 78.4308, rating: 4.6, address: 'Shamshabad, Hyderabad' },
    { id: 'h_hyd_8', name: 'Marriott Hotel', type: 'HOTEL', lat: 17.4234, lon: 78.4864, rating: 4.7, address: 'Tank Bund, Hyderabad' },
    { id: 'h_hyd_9', name: 'Royalton Hotel', type: 'HOTEL', lat: 17.3888, lon: 78.4782, rating: 4.2, address: 'Abids, Hyderabad' },

    // --- HYDERABAD RESTAURANTS ---
    { id: 'r_hyd_1', name: 'Paradise Biryani', type: 'RESTAURANT', lat: 17.4411, lon: 78.4867, rating: 4.5, address: 'SD Road, Secunderabad' },
    { id: 'r_hyd_2', name: 'Bawarchi', type: 'RESTAURANT', lat: 17.4065, lon: 78.4983, rating: 4.3, address: 'RTC X Roads, Hyderabad' },
    { id: 'r_hyd_3', name: 'Chutneys', type: 'RESTAURANT', lat: 17.4223, lon: 78.4477, rating: 4.4, address: 'Banjara Hills, Hyderabad' },
    { id: 'r_hyd_4', name: 'Shah Ghouse', type: 'RESTAURANT', lat: 17.3618, lon: 78.4700, rating: 4.2, address: 'Charminar, Hyderabad' },
    { id: 'r_hyd_5', name: 'Pista House', type: 'RESTAURANT', lat: 17.3638, lon: 78.4742, rating: 4.3, address: 'Shalibanda, Hyderabad' },
    { id: 'r_hyd_6', name: 'Grand Hotel', type: 'RESTAURANT', lat: 17.3891, lon: 78.4785, rating: 4.1, address: 'Abids, Hyderabad' },
    { id: 'r_hyd_7', name: 'Cafe Niloufer', type: 'RESTAURANT', lat: 17.4021, lon: 78.4623, rating: 4.6, address: 'Red Hills, Hyderabad' },

    // --- WARANGAL HOTELS ---
    { id: 'h_wgl_1', name: 'Haritha Kakatiya', type: 'HOTEL', lat: 17.9520, lon: 79.6010, rating: 4.0, address: 'Nakkalagutta, Warangal' },
    { id: 'h_wgl_2', name: 'Hotel Suprabha', type: 'HOTEL', lat: 17.9800, lon: 79.5800, rating: 3.9, address: 'Hanamkonda, Warangal' },
    { id: 'h_wgl_3', name: 'City Grand Hotel', type: 'HOTEL', lat: 17.9600, lon: 79.5900, rating: 3.8, address: 'Warangal Main Road' },
    { id: 'h_wgl_4', name: 'Ashoka Hotel', type: 'HOTEL', lat: 17.9780, lon: 79.5850, rating: 3.7, address: 'Hanamkonda, Warangal' },

    // --- WARANGAL RESTAURANTS ---
    { id: 'r_wgl_1', name: 'Bayleaf Restaurant', type: 'RESTAURANT', lat: 17.9750, lon: 79.5850, rating: 4.1, address: 'Hanamkonda, Warangal' },
    { id: 'r_wgl_2', name: 'Kakatiya Mess', type: 'RESTAURANT', lat: 17.9550, lon: 79.6000, rating: 4.5, address: 'Near Railway Station, Warangal' },
    { id: 'r_wgl_3', name: 'Haveli Restaurant', type: 'RESTAURANT', lat: 17.9820, lon: 79.5820, rating: 4.0, address: 'Kazipet Road, Warangal' },

    // --- BHADRACHALAM ---
    { id: 'h_bhd_1', name: 'Haritha Bhadrachalam', type: 'HOTEL', lat: 17.6690, lon: 80.8930, rating: 4.0, address: 'Near Temple, Bhadrachalam' },
    { id: 'h_bhd_2', name: 'Sita Nilayam', type: 'HOTEL', lat: 17.6675, lon: 80.8945, rating: 3.8, address: 'Market Road, Bhadrachalam' },
    { id: 'r_bhd_1', name: 'Sri Rama Vilas', type: 'RESTAURANT', lat: 17.6680, lon: 80.8940, rating: 4.2, address: 'Temple Road, Bhadrachalam' },
    { id: 'r_bhd_2', name: 'Godavari Mess', type: 'RESTAURANT', lat: 17.6700, lon: 80.8920, rating: 4.0, address: 'River Bank, Bhadrachalam' },

    // --- YADADRI ---
    { id: 'h_yad_1', name: 'Haritha Yadadri', type: 'HOTEL', lat: 17.5880, lon: 78.9430, rating: 4.1, address: 'Hill Top, Yadagirigutta' },
    { id: 'h_yad_2', name: 'Punnami Hotel', type: 'HOTEL', lat: 17.5800, lon: 78.9400, rating: 3.8, address: 'Downhill, Yadagirigutta' },
    { id: 'r_yad_1', name: 'Temple Canteen', type: 'RESTAURANT', lat: 17.5890, lon: 78.9420, rating: 3.8, address: 'Temple Complex, Yadagirigutta' },

    // --- RAMAPPA / PALAMPET ---
    { id: 'h_rmp_1', name: 'Haritha Lake View Resort', type: 'HOTEL', lat: 18.2600, lon: 79.9450, rating: 4.2, address: 'Ramappa Lake, Palampet' },
    { id: 'r_rmp_1', name: 'Ramappa Tourist Dhaba', type: 'RESTAURANT', lat: 18.2550, lon: 79.9400, rating: 3.6, address: 'Main Road, Palampet' },

    // --- PAKHAL ---
    { id: 'h_pak_1', name: 'Haritha Pakhal Hotel', type: 'HOTEL', lat: 17.9550, lon: 79.9920, rating: 3.9, address: 'Pakhal Sanctuary, Warangal' },
    { id: 'r_pak_1', name: 'Forest Canteen', type: 'RESTAURANT', lat: 17.9530, lon: 79.9900, rating: 3.5, address: 'Sanctuary Entrance' },

    // --- KONDAPALLI (VIJAYAWADA OUTSKIRTS) ---
    { id: 'h_kon_1', name: 'Hotel Marg Krishnaaya', type: 'HOTEL', lat: 16.5062, lon: 80.6480, rating: 4.3, address: 'Vijayawada (20km from Fort)' }, 
    { id: 'r_kon_1', name: 'Kondapalli Tiffins', type: 'RESTAURANT', lat: 16.6150, lon: 80.5350, rating: 4.0, address: 'Kondapalli Village' },

    // --- KONDAGATTU ---
    { id: 'h_kgt_1', name: 'Haritha Hotel Kondagattu', type: 'HOTEL', lat: 18.6450, lon: 78.9050, rating: 3.8, address: 'Near Temple, Kondagattu' },
    { id: 'r_kgt_1', name: 'Anjaneya Prasadam', type: 'RESTAURANT', lat: 18.6420, lon: 78.9030, rating: 4.5, address: 'Temple Premises' },

    // --- EMERGENCY (HYD) ---
    { id: 'e_hyd_1', name: 'Osmania General Hospital', type: 'HOSPITAL', lat: 17.3728, lon: 78.4750, rating: 3.8, address: 'Afzal Gunj, Hyderabad' },
    { id: 'e_hyd_2', name: 'Apollo Hospitals', type: 'HOSPITAL', lat: 17.4181, lon: 78.4126, rating: 4.9, address: 'Jubilee Hills, Hyderabad' },
    { id: 'p_hyd_1', name: 'Charminar Police Station', type: 'POLICE', lat: 17.3620, lon: 78.4750, address: 'Charminar, Hyderabad' },
    { id: 'p_hyd_2', name: 'Begumpet Police Station', type: 'POLICE', lat: 17.4350, lon: 78.4600, address: 'Begumpet, Hyderabad' },
    
    // --- EMERGENCY (WARANGAL) ---
    { id: 'e_wgl_1', name: 'MGM Hospital', type: 'HOSPITAL', lat: 17.9650, lon: 79.6050, rating: 3.5, address: 'MGM Circle, Warangal' },
    { id: 'p_wgl_1', name: 'Warangal Police HQ', type: 'POLICE', lat: 17.9600, lon: 79.6000, address: 'Subedari, Warangal' }
];

export const BADGES: Badge[] = [
    { id: 'explorer', name: 'Novice Explorer', icon: '🧭', description: 'Visit 1 Monument', unlocked: false },
    { id: 'historian', name: 'Historian', icon: '📜', description: 'Visit 5 Monuments', unlocked: false },
    { id: 'guardian', name: 'Safety Guardian', icon: '🛡️', description: 'Report a safety issue', unlocked: false },
    { id: 'royal', name: 'Royal Guest', icon: '👑', description: 'Visit a Palace', unlocked: false }
];
