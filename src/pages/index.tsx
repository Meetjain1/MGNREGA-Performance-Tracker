import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DistrictSelector from '@/components/DistrictSelector';
import MetricCard from '@/components/MetricCard';
import { formatLargeNumber, toNumber, getFinancialYear } from '@/lib/utils';
import type { DistrictData, CachedData } from '@/types';

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | undefined>();
  const [districtData, setDistrictData] = useState<CachedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'cache' | 'api' | 'fallback'>('api');

  useEffect(() => {
    if (selectedDistrict) {
      fetchDistrictData(selectedDistrict.id);
    }
  }, [selectedDistrict]);

  const fetchDistrictData = async (districtId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/mgnrega?districtId=${districtId}&financialYear=${getFinancialYear()}&month=${new Date().getMonth() + 1}`
      );
      const data = await res.json();

      if (data.success) {
        setDistrictData(data.data);
        setDataSource(data.source || 'api');
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Failed to fetch district data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>MGNREGA - Our Voice, Our Rights | हमारी आवाज़, हमारे अधिकार</title>
        <meta
          name="description"
          content="Track MGNREGA performance in your district. Simple and accessible for all citizens."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Header */}
        <header className="bg-primary-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl md:text-5xl font-bold text-center">
              <span className="block text-4xl md:text-6xl mb-2">हमारी आवाज़, हमारे अधिकार</span>
              Our Voice, Our Rights
            </h1>
            <p className="text-center mt-4 text-lg md:text-xl">
              <span className="block">मनरेगा प्रदर्शन ट्रैकर</span>
              MGNREGA Performance Tracker
            </p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Introduction */}
          <section className="card mb-8 bg-blue-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <span className="text-5xl">ℹ️</span>
              <div>
                <h2 className="text-2xl font-bold mb-3">
                  <span className="block text-3xl mb-2">मनरेगा क्या है?</span>
                  What is MGNREGA?
                </h2>
                <p className="text-lg leading-relaxed mb-3">
                  <span className="block mb-2">
                    महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा) भारत की सबसे बड़ी कल्याणकारी योजनाओं में से एक है।
                  </span>
                  The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is one of India's largest welfare programs.
                </p>
                <p className="text-lg leading-relaxed">
                  <span className="block mb-2">
                    यह ग्रामीण परिवारों को एक वित्तीय वर्ष में 100 दिनों के रोजगार की गारंटी देता है।
                  </span>
                  It guarantees 100 days of employment to rural households in a financial year.
                </p>
              </div>
            </div>
          </section>

          {/* District Selector */}
          <section className="mb-8">
            <DistrictSelector onSelect={setSelectedDistrict} selectedDistrict={selectedDistrict} />
          </section>

          {/* Loading State */}
          {loading && (
            <div className="card text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
              <p className="text-xl">
                <span className="block text-2xl mb-2">डेटा लोड हो रहा है...</span>
                Loading data...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card bg-red-50 border-2 border-red-300 text-center py-8">
              <span className="text-5xl mb-4 block">⚠️</span>
              <p className="text-xl text-red-700">
                <span className="block text-2xl mb-2">त्रुटि</span>
                {error}
              </p>
              <button
                onClick={() => selectedDistrict && fetchDistrictData(selectedDistrict.id)}
                className="btn-primary mt-4"
              >
                <span className="block">पुनः प्रयास करें</span>
                Retry
              </button>
            </div>
          )}

          {/* Dashboard */}
          {!loading && !error && districtData && selectedDistrict && (
            <>
              {/* District Header */}
              <div className="card mb-8 bg-gradient-to-r from-primary-50 to-orange-50 border-2 border-primary-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-900">
                      {selectedDistrict.nameHindi || selectedDistrict.name}
                    </h2>
                    <p className="text-xl text-gray-700 mt-1">
                      {selectedDistrict.name}, {selectedDistrict.stateName}
                    </p>
                  </div>
                  {dataSource === 'fallback' && (
                    <div className="bg-yellow-100 border-2 border-yellow-400 px-4 py-2 rounded-lg">
                      <p className="text-sm font-medium">
                        <span className="block">⚠️ पुराना डेटा</span>
                        Showing cached data
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Metrics */}
              <section className="mb-8">
                <h3 className="text-3xl font-bold mb-6 text-center">
                  <span className="block text-4xl mb-2">मुख्य आंकड़े</span>
                  Key Metrics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MetricCard
                    title="Job Cards Issued"
                    titleHindi="जारी जॉब कार्ड"
                    value={formatLargeNumber(toNumber(districtData.jobCardsIssued))}
                    icon="📋"
                    colorClass="bg-blue-500"
                    tooltip="Total number of job cards issued to households"
                    description="Total job cards provided"
                    descriptionHindi="कुल जारी किए गए कार्ड"
                  />

                  <MetricCard
                    title="Active Workers"
                    titleHindi="सक्रिय कामगार"
                    value={formatLargeNumber(toNumber(districtData.activeWorkers))}
                    icon="👷"
                    colorClass="bg-green-500"
                    tooltip="Number of workers who worked this month"
                    description="Workers employed this month"
                    descriptionHindi="इस महीने काम करने वाले"
                  />

                  <MetricCard
                    title="Person Days Generated"
                    titleHindi="उत्पन्न व्यक्ति दिवस"
                    value={formatLargeNumber(toNumber(districtData.personDaysGenerated))}
                    icon="📅"
                    colorClass="bg-purple-500"
                    tooltip="Total days of employment provided"
                    description="Total employment days"
                    descriptionHindi="कुल रोजगार दिवस"
                  />

                  <MetricCard
                    title="Women Employment"
                    titleHindi="महिला रोजगार"
                    value={formatLargeNumber(toNumber(districtData.womenPersonDays))}
                    icon="👩"
                    colorClass="bg-pink-500"
                    tooltip="Employment days provided to women"
                    description="Women person-days"
                    descriptionHindi="महिला व्यक्ति-दिवस"
                  />

                  <MetricCard
                    title="Works Completed"
                    titleHindi="पूर्ण कार्य"
                    value={formatLargeNumber(toNumber(districtData.totalWorksCompleted))}
                    icon="✅"
                    colorClass="bg-emerald-500"
                    tooltip="Number of works completed"
                    description="Completed projects"
                    descriptionHindi="पूर्ण परियोजनाएं"
                  />

                  <MetricCard
                    title="Works In Progress"
                    titleHindi="चल रहे कार्य"
                    value={formatLargeNumber(toNumber(districtData.totalWorksInProgress))}
                    icon="🚧"
                    colorClass="bg-orange-500"
                    tooltip="Number of works currently ongoing"
                    description="Ongoing projects"
                    descriptionHindi="चल रही परियोजनाएं"
                  />
                </div>
              </section>

              {/* Financial Data */}
              <section className="mb-8">
                <h3 className="text-3xl font-bold mb-6 text-center">
                  <span className="block text-4xl mb-2">वित्तीय डेटा</span>
                  Financial Data
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard
                    title="Total Expenditure"
                    titleHindi="कुल व्यय"
                    value={`₹${districtData.totalExpenditure?.toFixed(2) || '0'} L`}
                    icon="💰"
                    colorClass="bg-indigo-500"
                    tooltip="Total money spent (in Lakhs)"
                    description="In Lakhs"
                    descriptionHindi="लाख में"
                  />

                  <MetricCard
                    title="Wage Expenditure"
                    titleHindi="मजदूरी व्यय"
                    value={`₹${districtData.wageExpenditure?.toFixed(2) || '0'} L`}
                    icon="💵"
                    colorClass="bg-teal-500"
                    tooltip="Money paid as wages (in Lakhs)"
                    description="Paid to workers"
                    descriptionHindi="मजदूरों को भुगतान"
                  />

                  <MetricCard
                    title="Material Expenditure"
                    titleHindi="सामग्री व्यय"
                    value={`₹${districtData.materialExpenditure?.toFixed(2) || '0'} L`}
                    icon="🛠️"
                    colorClass="bg-amber-500"
                    tooltip="Money spent on materials (in Lakhs)"
                    description="Spent on materials"
                    descriptionHindi="सामग्री पर खर्च"
                  />
                </div>
              </section>

              {/* Payment Performance */}
              <section className="card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">⏱️</span>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      <span className="block text-3xl mb-1">औसत भुगतान समय</span>
                      Average Payment Time
                    </h3>
                    <p className="text-4xl font-bold text-green-700">
                      {districtData.averageDaysForPayment?.toFixed(1) || 'N/A'} दिन / days
                    </p>
                    <p className="text-lg text-gray-600 mt-2">
                      <span className="block">कानूनी सीमा: 15 दिन</span>
                      Legal limit: 15 days
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Empty State */}
          {!loading && !error && !districtData && (
            <div className="card text-center py-12">
              <span className="text-6xl mb-4 block">📊</span>
              <h3 className="text-2xl font-bold mb-4">
                <span className="block text-3xl mb-2">अपने जिले का डेटा देखें</span>
                View Your District's Data
              </h3>
              <p className="text-lg text-gray-600">
                <span className="block mb-2">ऊपर अपना जिला चुनें</span>
                Select your district above to see MGNREGA performance
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg mb-2">
              <span className="block text-xl mb-1">डेटा स्रोत: data.gov.in</span>
              Data Source: Government of India Open Data Platform
            </p>
            <p className="text-sm text-gray-400 mt-4">
              This is an independent citizen initiative to make MGNREGA data accessible to all.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
