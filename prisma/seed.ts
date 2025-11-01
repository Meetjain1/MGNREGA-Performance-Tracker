import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Bihar districts with coordinates
const biharDistricts = [
  { code: 'BR001', name: 'Patna', nameHindi: 'पटना', stateCode: 'BR', stateName: 'Bihar', lat: 25.5941, lng: 85.1376, population: 5838465 },
  { code: 'BR002', name: 'Gaya', nameHindi: 'गया', stateCode: 'BR', stateName: 'Bihar', lat: 24.7955, lng: 84.9994, population: 4391418 },
  { code: 'BR003', name: 'Bhagalpur', nameHindi: 'भागलपुर', stateCode: 'BR', stateName: 'Bihar', lat: 25.2425, lng: 86.9842, population: 3037766 },
  { code: 'BR004', name: 'Muzaffarpur', nameHindi: 'मुजफ्फरपुर', stateCode: 'BR', stateName: 'Bihar', lat: 26.1225, lng: 85.3906, population: 4801062 },
  { code: 'BR005', name: 'Darbhanga', nameHindi: 'दरभंगा', stateCode: 'BR', stateName: 'Bihar', lat: 26.1542, lng: 85.8918, population: 3921971 },
  { code: 'BR006', name: 'Purnia', nameHindi: 'पूर्णिया', stateCode: 'BR', stateName: 'Bihar', lat: 25.7771, lng: 87.4753, population: 3264619 },
  { code: 'BR007', name: 'Araria', nameHindi: 'अररिया', stateCode: 'BR', stateName: 'Bihar', lat: 26.1497, lng: 87.5162, population: 2811569 },
  { code: 'BR008', name: 'Madhubani', nameHindi: 'मधुबनी', stateCode: 'BR', stateName: 'Bihar', lat: 26.3561, lng: 86.0737, population: 4487379 },
  { code: 'BR009', name: 'Saharsa', nameHindi: 'सहरसा', stateCode: 'BR', stateName: 'Bihar', lat: 25.8804, lng: 86.5954, population: 1900661 },
  { code: 'BR010', name: 'Sitamarhi', nameHindi: 'सीतामढ़ी', stateCode: 'BR', stateName: 'Bihar', lat: 26.5936, lng: 85.4797, population: 3419622 },
  { code: 'BR011', name: 'Begusarai', nameHindi: 'बेगूसराय', stateCode: 'BR', stateName: 'Bihar', lat: 25.4182, lng: 86.1272, population: 2970541 },
  { code: 'BR012', name: 'Samastipur', nameHindi: 'समस्तीपुर', stateCode: 'BR', stateName: 'Bihar', lat: 25.8626, lng: 85.7815, population: 4261566 },
  { code: 'BR013', name: 'Vaishali', nameHindi: 'वैशाली', stateCode: 'BR', stateName: 'Bihar', lat: 25.9820, lng: 85.1320, population: 3495021 },
  { code: 'BR014', name: 'Nalanda', nameHindi: 'नालंदा', stateCode: 'BR', stateName: 'Bihar', lat: 25.1979, lng: 85.4479, population: 2877653 },
  { code: 'BR015', name: 'Aurangabad', nameHindi: 'औरंगाबाद', stateCode: 'BR', stateName: 'Bihar', lat: 24.7521, lng: 84.3742, population: 2540073 },
];

// Maharashtra districts (major ones)
const maharashtraDistricts = [
  { code: 'MH001', name: 'Mumbai', nameHindi: 'मुंबई', stateCode: 'MH', stateName: 'Maharashtra', lat: 19.0760, lng: 72.8777, population: 12442373 },
  { code: 'MH002', name: 'Pune', nameHindi: 'पुणे', stateCode: 'MH', stateName: 'Maharashtra', lat: 18.5204, lng: 73.8567, population: 9429408 },
  { code: 'MH003', name: 'Nagpur', nameHindi: 'नागपुर', stateCode: 'MH', stateName: 'Maharashtra', lat: 21.1458, lng: 79.0882, population: 4653570 },
  { code: 'MH004', name: 'Thane', nameHindi: 'ठाणे', stateCode: 'MH', stateName: 'Maharashtra', lat: 19.2183, lng: 72.9781, population: 11060148 },
  { code: 'MH005', name: 'Nashik', nameHindi: 'नाशिक', stateCode: 'MH', stateName: 'Maharashtra', lat: 19.9975, lng: 73.7898, population: 6109052 },
  { code: 'MH006', name: 'Aurangabad', nameHindi: 'औरंगाबाद', stateCode: 'MH', stateName: 'Maharashtra', lat: 19.8762, lng: 75.3433, population: 3701282 },
  { code: 'MH007', name: 'Solapur', nameHindi: 'सोलापुर', stateCode: 'MH', stateName: 'Maharashtra', lat: 17.6599, lng: 75.9064, population: 4317756 },
  { code: 'MH008', name: 'Kolhapur', nameHindi: 'कोल्हापुर', stateCode: 'MH', stateName: 'Maharashtra', lat: 16.7050, lng: 74.2433, population: 3876001 },
  { code: 'MH009', name: 'Ahmednagar', nameHindi: 'अहमदनगर', stateCode: 'MH', stateName: 'Maharashtra', lat: 19.0948, lng: 74.7480, population: 4543083 },
  { code: 'MH010', name: 'Satara', nameHindi: 'सतारा', stateCode: 'MH', stateName: 'Maharashtra', lat: 17.6805, lng: 73.9936, population: 3003741 },
];

// Rajasthan districts (major ones)
const rajasthanDistricts = [
  { code: 'RJ001', name: 'Jaipur', nameHindi: 'जयपुर', stateCode: 'RJ', stateName: 'Rajasthan', lat: 26.9124, lng: 75.7873, population: 6626178 },
  { code: 'RJ002', name: 'Jodhpur', nameHindi: 'जोधपुर', stateCode: 'RJ', stateName: 'Rajasthan', lat: 26.2389, lng: 73.0243, population: 3687165 },
  { code: 'RJ003', name: 'Udaipur', nameHindi: 'उदयपुर', stateCode: 'RJ', stateName: 'Rajasthan', lat: 24.5854, lng: 73.7125, population: 3068420 },
  { code: 'RJ004', name: 'Ajmer', nameHindi: 'अजमेर', stateCode: 'RJ', stateName: 'Rajasthan', lat: 26.4499, lng: 74.6399, population: 2583052 },
  { code: 'RJ005', name: 'Kota', nameHindi: 'कोटा', stateCode: 'RJ', stateName: 'Rajasthan', lat: 25.2138, lng: 75.8648, population: 1951014 },
  { code: 'RJ006', name: 'Bikaner', nameHindi: 'बीकानेर', stateCode: 'RJ', stateName: 'Rajasthan', lat: 28.0229, lng: 73.3119, population: 2363937 },
  { code: 'RJ007', name: 'Alwar', nameHindi: 'अलवर', stateCode: 'RJ', stateName: 'Rajasthan', lat: 27.5530, lng: 76.6346, population: 3674179 },
  { code: 'RJ008', name: 'Bharatpur', nameHindi: 'भरतपुर', stateCode: 'RJ', stateName: 'Rajasthan', lat: 27.2152, lng: 77.4900, population: 2548462 },
];

// West Bengal districts (major ones)
const westBengalDistricts = [
  { code: 'WB001', name: 'Kolkata', nameHindi: 'कोलकाता', stateCode: 'WB', stateName: 'West Bengal', lat: 22.5726, lng: 88.3639, population: 4496694 },
  { code: 'WB002', name: 'North 24 Parganas', nameHindi: 'उत्तर 24 परगना', stateCode: 'WB', stateName: 'West Bengal', lat: 22.6157, lng: 88.4005, population: 10009781 },
  { code: 'WB003', name: 'South 24 Parganas', nameHindi: 'दक्षिण 24 परगना', stateCode: 'WB', stateName: 'West Bengal', lat: 22.1564, lng: 88.4309, population: 8161961 },
  { code: 'WB004', name: 'Howrah', nameHindi: 'हावड़ा', stateCode: 'WB', stateName: 'West Bengal', lat: 22.5958, lng: 88.2636, population: 4850029 },
  { code: 'WB005', name: 'Hooghly', nameHindi: 'हुगली', stateCode: 'WB', stateName: 'West Bengal', lat: 22.9089, lng: 88.3967, population: 5519145 },
  { code: 'WB006', name: 'Bardhaman', nameHindi: 'बर्धमान', stateCode: 'WB', stateName: 'West Bengal', lat: 23.2324, lng: 87.8615, population: 7717563 },
  { code: 'WB007', name: 'Murshidabad', nameHindi: 'मुर्शिदाबाद', stateCode: 'WB', stateName: 'West Bengal', lat: 24.1751, lng: 88.2426, population: 7103807 },
  { code: 'WB008', name: 'Nadia', nameHindi: 'नदिया', stateCode: 'WB', stateName: 'West Bengal', lat: 23.4711, lng: 88.5565, population: 5167600 },
];

// Uttar Pradesh districts with coordinates (major districts)
const upDistricts = [
  { code: 'UP001', name: 'Agra', nameHindi: 'आगरा', lat: 27.1767, lng: 78.0081, population: 4418797 },
  { code: 'UP002', name: 'Aligarh', nameHindi: 'अलीगढ़', lat: 27.8974, lng: 78.0880, population: 3673889 },
  { code: 'UP003', name: 'Allahabad', nameHindi: 'इलाहाबाद', lat: 25.4358, lng: 81.8463, population: 5954391 },
  { code: 'UP004', name: 'Ambedkar Nagar', nameHindi: 'अम्बेडकर नगर', lat: 26.4058, lng: 82.6997, population: 2397888 },
  { code: 'UP005', name: 'Amethi', nameHindi: 'अमेठी', lat: 26.1542, lng: 81.8058, population: 1800000 },
  { code: 'UP006', name: 'Amroha', nameHindi: 'अमरोहा', lat: 28.9034, lng: 78.4672, population: 1840221 },
  { code: 'UP007', name: 'Auraiya', nameHindi: 'औरैया', lat: 26.4658, lng: 79.5134, population: 1379545 },
  { code: 'UP008', name: 'Azamgarh', nameHindi: 'आज़मगढ़', lat: 26.0686, lng: 83.1840, population: 4613913 },
  { code: 'UP009', name: 'Baghpat', nameHindi: 'बागपत', lat: 28.9465, lng: 77.2157, population: 1303048 },
  { code: 'UP010', name: 'Bahraich', nameHindi: 'बहराइच', lat: 27.5742, lng: 81.5941, population: 3487731 },
  { code: 'UP011', name: 'Ballia', nameHindi: 'बलिया', lat: 25.7633, lng: 84.1494, population: 3239774 },
  { code: 'UP012', name: 'Balrampur', nameHindi: 'बलरामपुर', lat: 27.4318, lng: 82.1820, population: 2148665 },
  { code: 'UP013', name: 'Banda', nameHindi: 'बांदा', lat: 25.4767, lng: 80.3348, population: 1799541 },
  { code: 'UP014', name: 'Barabanki', nameHindi: 'बाराबंकी', lat: 26.9247, lng: 81.1857, population: 3260699 },
  { code: 'UP015', name: 'Bareilly', nameHindi: 'बरेली', lat: 28.3670, lng: 79.4304, population: 4448359 },
  { code: 'UP016', name: 'Basti', nameHindi: 'बस्ती', lat: 26.8048, lng: 82.7391, population: 2464464 },
  { code: 'UP017', name: 'Bijnor', nameHindi: 'बिजनौर', lat: 29.3731, lng: 78.1364, population: 3682713 },
  { code: 'UP018', name: 'Budaun', nameHindi: 'बदायूं', lat: 28.0386, lng: 79.1142, population: 3681896 },
  { code: 'UP019', name: 'Bulandshahr', nameHindi: 'बुलंदशहर', lat: 28.4068, lng: 77.8498, population: 3499171 },
  { code: 'UP020', name: 'Chandauli', nameHindi: 'चंदौली', lat: 25.2667, lng: 83.2667, population: 1952756 },
  { code: 'UP021', name: 'Chitrakoot', nameHindi: 'चित्रकूट', lat: 25.2000, lng: 80.9000, population: 991730 },
  { code: 'UP022', name: 'Deoria', nameHindi: 'देवरिया', lat: 26.5024, lng: 83.7791, population: 3100946 },
  { code: 'UP023', name: 'Etah', nameHindi: 'एटा', lat: 27.6333, lng: 78.6667, population: 1774480 },
  { code: 'UP024', name: 'Etawah', nameHindi: 'इटावा', lat: 26.7855, lng: 79.0215, population: 1581810 },
  { code: 'UP025', name: 'Faizabad', nameHindi: 'फैजाबाद', lat: 26.7760, lng: 82.1494, population: 2470996 },
  { code: 'UP026', name: 'Farrukhabad', nameHindi: 'फर्रुखाबाद', lat: 27.3882, lng: 79.5801, population: 1885204 },
  { code: 'UP027', name: 'Fatehpur', nameHindi: 'फतेहपुर', lat: 25.9303, lng: 80.8123, population: 2632733 },
  { code: 'UP028', name: 'Firozabad', nameHindi: 'फ़िरोज़ाबाद', lat: 27.1591, lng: 78.3957, population: 2498156 },
  { code: 'UP029', name: 'Gautam Buddha Nagar', nameHindi: 'गौतम बुद्ध नगर', lat: 28.4744, lng: 77.5040, population: 1648115 },
  { code: 'UP030', name: 'Ghaziabad', nameHindi: 'गाज़ियाबाद', lat: 28.6692, lng: 77.4538, population: 4681645 },
  { code: 'UP031', name: 'Ghazipur', nameHindi: 'ग़ाज़ीपुर', lat: 25.5800, lng: 83.5780, population: 3622727 },
  { code: 'UP032', name: 'Gonda', nameHindi: 'गोंडा', lat: 27.1333, lng: 81.9614, population: 3433919 },
  { code: 'UP033', name: 'Gorakhpur', nameHindi: 'गोरखपुर', lat: 26.7606, lng: 83.3732, population: 4440895 },
  { code: 'UP034', name: 'Hamirpur', nameHindi: 'हमीरपुर', lat: 25.9570, lng: 80.1483, population: 1104002 },
  { code: 'UP035', name: 'Hapur', nameHindi: 'हापुड़', lat: 28.7434, lng: 77.7762, population: 1332042 },
  { code: 'UP036', name: 'Hardoi', nameHindi: 'हरदोई', lat: 27.3965, lng: 80.1257, population: 4092845 },
  { code: 'UP037', name: 'Hathras', nameHindi: 'हाथरस', lat: 27.5950, lng: 78.0500, population: 1564708 },
  { code: 'UP038', name: 'Jalaun', nameHindi: 'जालौन', lat: 26.1441, lng: 79.3351, population: 1670718 },
  { code: 'UP039', name: 'Jaunpur', nameHindi: 'जौनपुर', lat: 25.7458, lng: 82.6841, population: 4476072 },
  { code: 'UP040', name: 'Jhansi', nameHindi: 'झाँसी', lat: 25.4484, lng: 78.5685, population: 2006896 },
  { code: 'UP041', name: 'Kannauj', nameHindi: 'कन्नौज', lat: 27.0514, lng: 79.9144, population: 1656616 },
  { code: 'UP042', name: 'Kanpur Dehat', nameHindi: 'कानपुर देहात', lat: 26.4670, lng: 79.8877, population: 1795092 },
  { code: 'UP043', name: 'Kanpur Nagar', nameHindi: 'कानपुर नगर', lat: 26.4499, lng: 80.3319, population: 4581268 },
  { code: 'UP044', name: 'Kasganj', nameHindi: 'कासगंज', lat: 27.8093, lng: 78.6460, population: 1436719 },
  { code: 'UP045', name: 'Kaushambi', nameHindi: 'कौशाम्बी', lat: 25.5312, lng: 81.3778, population: 1599596 },
  { code: 'UP046', name: 'Kushinagar', nameHindi: 'कुशीनगर', lat: 26.7411, lng: 83.8883, population: 3564544 },
  { code: 'UP047', name: 'Lakhimpur Kheri', nameHindi: 'लखीमपुर खीरी', lat: 27.9474, lng: 80.7791, population: 4021243 },
  { code: 'UP048', name: 'Lalitpur', nameHindi: 'ललितपुर', lat: 24.6906, lng: 78.4136, population: 1218002 },
  { code: 'UP049', name: 'Lucknow', nameHindi: 'लखनऊ', lat: 26.8467, lng: 80.9462, population: 4589838 },
  { code: 'UP050', name: 'Maharajganj', nameHindi: 'महाराजगंज', lat: 27.1441, lng: 83.5595, population: 2684703 },
  { code: 'UP051', name: 'Mahoba', nameHindi: 'महोबा', lat: 25.2920, lng: 79.8727, population: 876055 },
  { code: 'UP052', name: 'Mainpuri', nameHindi: 'मैनपुरी', lat: 27.2354, lng: 79.0270, population: 1868529 },
  { code: 'UP053', name: 'Mathura', nameHindi: 'मथुरा', lat: 27.4924, lng: 77.6737, population: 2547184 },
  { code: 'UP054', name: 'Mau', nameHindi: 'मऊ', lat: 25.9420, lng: 83.5612, population: 2205968 },
  { code: 'UP055', name: 'Meerut', nameHindi: 'मेरठ', lat: 28.9845, lng: 77.7064, population: 3443689 },
  { code: 'UP056', name: 'Mirzapur', nameHindi: 'मिर्ज़ापुर', lat: 25.1460, lng: 82.5690, population: 2494533 },
  { code: 'UP057', name: 'Moradabad', nameHindi: 'मुरादाबाद', lat: 28.8389, lng: 78.7378, population: 4772006 },
  { code: 'UP058', name: 'Muzaffarnagar', nameHindi: 'मुज़फ़्फ़रनगर', lat: 29.4727, lng: 77.7085, population: 4143512 },
  { code: 'UP059', name: 'Pilibhit', nameHindi: 'पीलीभीत', lat: 28.6315, lng: 79.8046, population: 2031007 },
  { code: 'UP060', name: 'Pratapgarh', nameHindi: 'प्रतापगढ़', lat: 25.8936, lng: 81.9426, population: 3173752 },
  { code: 'UP061', name: 'Raebareli', nameHindi: 'रायबरेली', lat: 26.2313, lng: 81.2460, population: 3404004 },
  { code: 'UP062', name: 'Rampur', nameHindi: 'रामपुर', lat: 28.8154, lng: 79.0256, population: 2335819 },
  { code: 'UP063', name: 'Saharanpur', nameHindi: 'सहारनपुर', lat: 29.9680, lng: 77.5460, population: 3466382 },
  { code: 'UP064', name: 'Sambhal', nameHindi: 'संभल', lat: 28.5850, lng: 78.5700, population: 2290770 },
  { code: 'UP065', name: 'Sant Kabir Nagar', nameHindi: 'संत कबीर नगर', lat: 26.7650, lng: 83.0350, population: 1714300 },
  { code: 'UP066', name: 'Shahjahanpur', nameHindi: 'शाहजहाँपुर', lat: 27.8773, lng: 79.9100, population: 3006538 },
  { code: 'UP067', name: 'Shamli', nameHindi: 'शामली', lat: 29.4500, lng: 77.3100, population: 1320529 },
  { code: 'UP068', name: 'Shravasti', nameHindi: 'श्रावस्ती', lat: 27.5100, lng: 82.0200, population: 1117361 },
  { code: 'UP069', name: 'Siddharthnagar', nameHindi: 'सिद्धार्थनगर', lat: 27.2550, lng: 83.0550, population: 2553526 },
  { code: 'UP070', name: 'Sitapur', nameHindi: 'सीतापुर', lat: 27.5672, lng: 80.6819, population: 4483992 },
  { code: 'UP071', name: 'Sonbhadra', nameHindi: 'सोनभद्र', lat: 24.6900, lng: 83.0700, population: 1862612 },
  { code: 'UP072', name: 'Sultanpur', nameHindi: 'सुल्तानपुर', lat: 26.2646, lng: 82.0736, population: 3797117 },
  { code: 'UP073', name: 'Unnao', nameHindi: 'उन्नाव', lat: 26.5464, lng: 80.4879, population: 3110595 },
  { code: 'UP074', name: 'Varanasi', nameHindi: 'वाराणसी', lat: 25.3176, lng: 82.9739, population: 3682194 },
];

async function main() {
  console.log('Starting seed...');

  // Clear existing data (optional, comment out if you want to preserve data)
  await prisma.userActivity.deleteMany();
  await prisma.aPIRequestLog.deleteMany();
  await prisma.cachedMGNREGAData.deleteMany();
  await prisma.district.deleteMany();

  console.log('Cleared existing data');

  // Combine all districts
  const allDistrictsData = [
    ...biharDistricts,
    ...maharashtraDistricts,
    ...rajasthanDistricts,
    ...westBengalDistricts,
    ...upDistricts.map(d => ({ ...d, stateCode: 'UP', stateName: 'Uttar Pradesh' })),
  ];

  console.log(`Seeding ${allDistrictsData.length} districts from ${5} states...`);

  // Seed all districts
  for (const district of allDistrictsData) {
    await prisma.district.create({
      data: {
        code: district.code,
        name: district.name,
        nameHindi: district.nameHindi,
        stateCode: district.stateCode,
        stateName: district.stateName,
        latitude: district.lat,
        longitude: district.lng,
        population: district.population,
      },
    });
  }

  console.log(`Seeded ${allDistrictsData.length} districts`);

  // Add sample cached data for ALL districts (current month)
  const currentYear = new Date().getFullYear();
  const financialYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  const currentMonth = new Date().getMonth() + 1;

  const allDistricts = await prisma.district.findMany();

  console.log(`Creating sample data for ${allDistricts.length} districts...`);

  for (const district of allDistricts) {
    // Create realistic data proportional to population
    const populationFactor = (district.population || 2000000) / 1000000; // Convert to millions, default 2M
    
    await prisma.cachedMGNREGAData.create({
      data: {
        districtId: district.id,
        financialYear,
        month: currentMonth,
        jobCardsIssued: BigInt(Math.floor((Math.random() * 30000 + 20000) * populationFactor)),
        activeJobCards: BigInt(Math.floor((Math.random() * 20000 + 10000) * populationFactor)),
        activeWorkers: BigInt(Math.floor((Math.random() * 25000 + 15000) * populationFactor)),
        householdsWorked: BigInt(Math.floor((Math.random() * 15000 + 8000) * populationFactor)),
        personDaysGenerated: BigInt(Math.floor((Math.random() * 400000 + 200000) * populationFactor)),
        womenPersonDays: BigInt(Math.floor((Math.random() * 250000 + 120000) * populationFactor)),
        scPersonDays: BigInt(Math.floor((Math.random() * 80000 + 40000) * populationFactor)),
        stPersonDays: BigInt(Math.floor((Math.random() * 40000 + 20000) * populationFactor)),
        totalWorksStarted: BigInt(Math.floor((Math.random() * 400 + 200) * populationFactor)),
        totalWorksCompleted: BigInt(Math.floor((Math.random() * 250 + 100) * populationFactor)),
        totalWorksInProgress: BigInt(Math.floor((Math.random() * 150 + 80) * populationFactor)),
        totalExpenditure: (Math.random() * 8000 + 4000) * populationFactor,
        wageExpenditure: (Math.random() * 5500 + 2800) * populationFactor,
        materialExpenditure: (Math.random() * 2500 + 1200) * populationFactor,
        averageDaysForPayment: Math.random() * 15 + 8,
        isStale: false,
      },
    });
  }

  console.log(`Seeded sample data for ${allDistricts.length} districts`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
