import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Inbox,
  Package,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  KeyRound,
  ShieldCheck,
  LogOut,
  Upload,
  RotateCcw,
  Link2,
  Trash2,
  Edit3,
  Plus,
  RefreshCw,
  ExternalLink,
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  Database,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  Building2,
  Film,
  BarChart3,
  MousePointerClick,
  TrendingUp,
  Globe2,
  Crop,
} from 'lucide-react';
import { api } from '../lib/api';
import { ASSET_DEFAULTS, ASSET_GROUPS } from '../config/assets';
import { useMedia } from '../context/MediaContext';
import {
  FAQ as FALLBACK_FAQS,
  DEFAULT_BLOGS,
  PRODUCT_CATEGORIES,
  DEFAULT_INFRASTRUCTURE,
} from '../config/siteContent';
import GrowLoader from '../components/GrowLoader';
import ImageCropModal from '../components/ImageCropModal';

const inputCls =
  'w-full rounded-xl border border-shell-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200/50';

function formatDateTime(isoString) {
  if (!isoString) return { date: '—', time: '—' };
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: String(isoString), time: '' };
    const date = d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ' IST';
    return { date, time };
  } catch {
    return { date: String(isoString), time: '' };
  }
}

// -------------------------------------------------------------
// WEBSITE VISITS & ENQUIRY ANALYTICS VISUALIZATION
// -------------------------------------------------------------
function AnalyticsOverview({ analytics, onReset, resetting }) {
  if (!analytics) return null;

  const {
    totalVisits = 0,
    todayVisits = 0,
    last7DaysVisits = 0,
    totalEnquiries = 0,
    domesticCount = 0,
    internationalCount = 0,
    dailySeries = [],
    pageClicks = [],
    countryClicks = [],
    productBreakdown = [],
  } = analytics;

  const maxDailyVisits = Math.max(1, ...dailySeries.map((d) => Math.max(d.visits || 0, d.enquiries || 0)));
  const maxPageClicks = Math.max(1, ...pageClicks.map((p) => p.clicks || 0));
  const maxCountryClicks = Math.max(1, ...countryClicks.map((c) => c.clicks || 0));
  const maxProductCount = Math.max(1, ...productBreakdown.map((p) => p.count || 0));
  const topCountry = countryClicks[0] || null;

  return (
    <div className="space-y-5 rounded-3xl border border-leaf-200/80 bg-gradient-to-br from-white via-leaf-50/30 to-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-shell-200/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-leaf-700 text-white shadow-sm">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="font-head text-lg font-bold text-shell-900">
              Website Traffic &amp; Enquiry Analytics
            </h3>
            <p className="text-xs text-shell-500">
              100% real-time visitor clicks, country origin &amp; enquiry insights (IST)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-100 border border-leaf-300 px-3 py-1 text-xs font-bold text-leaf-900">
            <span className="h-2 w-2 rounded-full bg-leaf-600 animate-pulse" />
            Live Tracking Active
          </span>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={resetting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              title="Reset all website visit and click counters to 0"
            >
              <RotateCcw size={13} className={resetting ? 'animate-spin' : ''} />
              {resetting ? 'Resetting...' : 'Reset Click Data'}
            </button>
          )}
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-shell-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-shell-500">
            <span>Total Website Visits</span>
            <MousePointerClick size={15} className="text-leaf-600" />
          </div>
          <p className="mt-2 font-head text-3xl font-extrabold text-shell-900">
            {totalVisits.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs font-medium text-leaf-700">
            +{todayVisits} today · {last7DaysVisits} in last 7 days
          </p>
        </div>

        <div className="rounded-2xl border border-shell-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-shell-500">
            <span>Total Enquiries</span>
            <Inbox size={15} className="text-leaf-600" />
          </div>
          <p className="mt-2 font-head text-3xl font-extrabold text-shell-900">
            {totalEnquiries.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-shell-500">
            🌍 {internationalCount} Intl · 🇮🇳 {domesticCount} Domestic
          </p>
        </div>

        <div className="rounded-2xl border border-shell-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-shell-500">
            <span>Top Visiting Country</span>
            <Globe2 size={15} className="text-leaf-600" />
          </div>
          <p className="mt-2 font-head text-2xl sm:text-3xl font-extrabold text-leaf-900 truncate">
            {topCountry ? topCountry.country : 'No clicks yet'}
          </p>
          <p className="mt-1 text-xs text-shell-500">
            {topCountry
              ? `${topCountry.clicks} clicks · ${countryClicks.length} ${
                  countryClicks.length === 1 ? 'country' : 'countries'
                } active`
              : 'Waiting for visitor clicks'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left Column: 14-Day Visits vs Enquiries + Clicks by Country */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-shell-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-head text-sm font-bold text-shell-900">
                  Last 14 Days — Website Visits vs Enquiries
                </h4>
                <p className="text-[11px] text-shell-500">
                  Daily visitor traffic compared with submitted customer enquiries
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-leaf-800">
                  <span className="h-2.5 w-2.5 rounded-sm bg-leaf-600" /> Visits
                </span>
                <span className="flex items-center gap-1.5 text-amber-800">
                  <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Enquiries
                </span>
              </div>
            </div>

            <div className="flex h-44 items-end gap-1.5 sm:gap-2 pt-4 border-b border-shell-200 pb-2">
              {dailySeries.map((day) => {
                const visitHeight = Math.max(
                  day.visits > 0 ? 10 : 3,
                  Math.round((day.visits / maxDailyVisits) * 100)
                );
                const enqHeight = Math.max(
                  day.enquiries > 0 ? 10 : 0,
                  Math.round((day.enquiries / maxDailyVisits) * 100)
                );
                return (
                  <div
                    key={day.date}
                    className="group relative flex flex-1 flex-col items-center h-full justify-end"
                  >
                    <div className="pointer-events-none absolute -top-8 z-10 hidden whitespace-nowrap rounded-lg bg-shell-900 px-2 py-1 text-[10px] font-bold text-white shadow group-hover:block">
                      {day.label}: {day.visits} visits, {day.enquiries} enquiries
                    </div>
                    <div className="flex w-full items-end justify-center gap-0.5 h-full">
                      <div
                        className="w-1/2 max-w-[14px] rounded-t-md bg-leaf-600 transition-all duration-500 group-hover:bg-leaf-500"
                        style={{ height: `${visitHeight}%` }}
                      />
                      {day.enquiries > 0 && (
                        <div
                          className="w-1/2 max-w-[14px] rounded-t-md bg-amber-500 transition-all duration-500"
                          style={{ height: `${enqHeight}%` }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-medium text-shell-500">
              {dailySeries.filter((_, i) => i % 2 === 0 || i === dailySeries.length - 1).map((d) => (
                <span key={d.date}>{d.label}</span>
              ))}
            </div>
          </div>

          {/* Website Clicks by Country */}
          <div className="rounded-2xl border border-shell-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-head text-sm font-bold text-shell-900 flex items-center gap-2">
                  <Globe2 size={15} className="text-leaf-700" /> Website Clicks by Country
                </h4>
                <p className="text-[11px] text-shell-500">
                  Real geographic origin of website visitors
                </p>
              </div>
              <span className="text-[11px] font-bold text-leaf-800 bg-leaf-50 border border-leaf-200 px-2.5 py-0.5 rounded-full">
                {countryClicks.length} {countryClicks.length === 1 ? 'Country' : 'Countries'}
              </span>
            </div>

            {countryClicks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-shell-200 bg-shell-50/50 py-6 text-center text-xs text-shell-500">
                No country click data recorded yet. Open any public page on the website to record live visits.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {countryClicks.slice(0, 8).map((c) => {
                  const pct = Math.round((c.clicks / maxCountryClicks) * 100);
                  const sharePct =
                    totalVisits > 0 ? Math.round((c.clicks / totalVisits) * 100) : 100;
                  return (
                    <div
                      key={c.country}
                      className="rounded-xl border border-shell-100 bg-shell-50/50 p-3"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                        <span className="font-bold text-shell-900 truncate">{c.country}</span>
                        <span className="shrink-0 font-bold text-leaf-800">
                          {c.clicks} {c.clicks === 1 ? 'click' : 'clicks'} ({sharePct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-shell-200/80">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-leaf-700 to-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.max(8, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tab Clicks + Product Demand */}
        <div className="lg:col-span-5 grid gap-4 content-start">
          <div className="rounded-2xl border border-shell-200 bg-white p-4">
            <div className="mb-3">
              <h4 className="font-head text-xs font-bold uppercase tracking-wider text-shell-700">
                Tab Clicks Breakdown
              </h4>
              <p className="text-[11px] text-shell-500 mt-0.5">
                Every navigation click across website tabs (separate from unique website visits)
              </p>
            </div>
            <div className="space-y-2.5">
              {pageClicks.map((p) => {
                const pct = Math.round((p.clicks / maxPageClicks) * 100);
                return (
                  <div key={p.page} className="text-xs">
                    <div className="flex justify-between font-semibold text-shell-800 mb-1">
                      <span>{p.page}</span>
                      <span className="text-leaf-800 font-bold">{p.clicks} clicks</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-shell-100">
                      <div
                        className="h-full rounded-full bg-leaf-600 transition-all duration-500"
                        style={{ width: `${Math.max(p.clicks > 0 ? 6 : 0, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {productBreakdown.length > 0 && (
            <div className="rounded-2xl border border-shell-200 bg-white p-4">
              <h4 className="font-head text-xs font-bold uppercase tracking-wider text-shell-700 mb-3">
                Most Enquired Products
              </h4>
              <div className="space-y-2">
                {productBreakdown.slice(0, 4).map((item) => {
                  const pct = Math.round((item.count / maxProductCount) * 100);
                  return (
                    <div key={item.product} className="text-xs">
                      <div className="flex justify-between font-semibold text-shell-800 mb-1 gap-2">
                        <span className="truncate">{item.product}</span>
                        <span className="shrink-0 text-amber-800 font-bold">{item.count} leads</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-shell-100">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all duration-500"
                          style={{ width: `${Math.max(8, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 1: CUSTOMER ENQUIRIES
// -------------------------------------------------------------
function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [resettingClicks, setResettingClicks] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setMsg('');
    try {
      const [enqData, statsData] = await Promise.all([
        api.getEnquiries(filter),
        api.getAnalyticsSummary().catch(() => null),
      ]);
      setEnquiries(Array.isArray(enqData) ? enqData : []);
      if (statsData) setAnalytics(statsData);
    } catch (e) {
      setMsg(e.message || 'Could not fetch enquiries. Ensure MongoDB is connected.');
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleResetClicks = async () => {
    if (
      !window.confirm(
        'Reset all website visit and click counters (Total Visits, Daily Visits, Page Clicks, and Country Clicks) back to 0? Your customer enquiries will NOT be deleted.'
      )
    ) {
      return;
    }
    setResettingClicks(true);
    try {
      await api.resetAnalytics();
      try {
        sessionStorage.removeItem('hw_session_visit_counted');
      } catch {}
      const freshStats = await api.getAnalyticsSummary().catch(() => null);
      if (freshStats) setAnalytics(freshStats);
    } catch (e) {
      alert(e.message || 'Failed to reset click data');
    }
    setResettingClicks(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await api.updateEnquiryStatus(id, status);
      setEnquiries((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
    } catch (e) {
      alert(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await api.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((item) => item._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const newCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="space-y-6">
      <AnalyticsOverview analytics={analytics} onReset={handleResetClicks} resetting={resettingClicks} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-shell-900">Customer Enquiries & Export Leads</h2>
          <p className="text-sm text-shell-600">
            Real-time enquiries submitted through the HarWest Contact Us form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-shell-200 bg-white px-3.5 py-2 text-sm font-semibold text-shell-700 shadow-sm transition hover:bg-shell-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-shell-200 pb-3">
        {[
          { key: 'all', label: 'All Enquiries' },
          { key: 'new', label: `New (${newCount})` },
          { key: 'contacted', label: 'Contacted' },
          { key: 'archived', label: 'Archived' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              filter === t.key
                ? 'bg-leaf-700 text-white shadow'
                : 'bg-white text-shell-600 hover:bg-shell-100 border border-shell-200/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-shell-500">Loading customer submissions...</div>
      ) : enquiries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-shell-300 bg-white p-12 text-center">
          <Inbox size={40} className="mx-auto text-shell-400" />
          <h3 className="mt-3 font-head text-lg font-bold text-shell-800">No enquiries found</h3>
          <p className="mt-1 text-sm text-shell-500 max-w-md mx-auto">
            When prospective buyers fill out the inquiry form on your website, their contact details, requested volume, and message will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enq) => {
            const { date, time } = formatDateTime(enq.createdAt);
            const isNew = enq.status === 'new';
            const isContacted = enq.status === 'contacted';

            return (
              <div
                key={enq._id}
                className={`rounded-2xl border p-6 transition shadow-sm ${
                  isNew
                    ? 'border-leaf-300 bg-white ring-1 ring-leaf-400/40'
                    : 'border-shell-200 bg-white/90'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-head text-lg font-bold text-shell-900">{enq.name}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                          isNew
                            ? 'bg-leaf-100 text-leaf-800 border border-leaf-300'
                            : isContacted
                            ? 'bg-coconut-100 text-coconut-800 border border-coconut-300'
                            : 'bg-shell-100 text-shell-600'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-shell-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-leaf-600" /> {date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-leaf-600" /> {time}
                      </span>
                      {enq.email && (
                        <a
                          href={`mailto:${enq.email}`}
                          className="flex items-center gap-1 font-semibold text-leaf-700 hover:underline"
                        >
                          <Mail size={13} /> {enq.email}
                        </a>
                      )}
                      {enq.phone && (
                        <a
                          href={`tel:${enq.phone}`}
                          className="flex items-center gap-1 text-shell-700 hover:underline"
                        >
                          <Phone size={13} /> {enq.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isNew ? (
                      <button
                        onClick={() => updateStatus(enq._id, 'contacted')}
                        className="flex items-center gap-1 rounded-xl bg-leaf-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-leaf-700"
                      >
                        <CheckCircle size={14} /> Mark Contacted
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(enq._id, 'new')}
                        className="rounded-xl border border-shell-200 px-3 py-1.5 text-xs font-semibold text-shell-600 hover:bg-shell-50"
                      >
                        Mark New
                      </button>
                    )}
                    <button
                      onClick={() => remove(enq._id)}
                      className="rounded-xl border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                      title="Delete enquiry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Type / Company / Location / Product / Volume Meta */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span
                    className={`rounded-lg px-2.5 py-1 font-bold ${
                      enq.enquiryType === 'domestic' ? 'bg-amber-100 text-amber-900' : 'bg-leaf-100 text-leaf-900'
                    }`}
                  >
                    {enq.enquiryType === 'domestic' ? '🇮🇳 Domestic' : '🌍 International'}
                  </span>
                  {enq.company && (
                    <span className="rounded-lg bg-shell-100 px-2.5 py-1 font-semibold text-shell-800">
                      🏢 {enq.company}
                    </span>
                  )}
                  {(enq.country || enq.state) && (
                    <span className="rounded-lg bg-shell-100 px-2.5 py-1 font-semibold text-shell-800">
                      📍 {enq.enquiryType === 'domestic' ? `State: ${enq.state}` : `Country: ${enq.country}`}
                    </span>
                  )}
                  {enq.product && (
                    <span className="rounded-lg bg-shell-100 px-2.5 py-1 font-semibold text-shell-800">
                      📦 Product: {enq.product}
                    </span>
                  )}
                  {enq.volume && (
                    <span className="rounded-lg bg-shell-100 px-2.5 py-1 font-semibold text-shell-800">
                      🚢 Est. Volume: {enq.volume}
                    </span>
                  )}
                </div>

                {/* Message Body */}
                <div className="mt-3.5 rounded-xl bg-shell-50/80 p-4 text-sm leading-relaxed text-shell-800 whitespace-pre-wrap border border-shell-100">
                  {enq.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// TAB 2: PRODUCTS MANAGER (CRUD)
// -------------------------------------------------------------
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploadPct, setUploadPct] = useState(null);
  const [variantUploadIdx, setVariantUploadIdx] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [cropRequest, setCropRequest] = useState(null); // { fileOrUrl, target: 'main' | number, title }
  const fileRef = useRef(null);

  const EMPTY_FORM = {
    name: '',
    short: '',
    image: '',
    specsText: '',
    categories: [],
    variantItems: [],
    isActive: true,
  };
  const [form, setForm] = useState(EMPTY_FORM);

  // Specs are edited as "Label: value" lines.
  const specsToText = (specs) =>
    Object.entries(specs || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
  const textToSpecs = (text) => {
    const out = {};
    String(text || '')
      .split('\n')
      .forEach((line) => {
        const i = line.indexOf(':');
        if (i < 1) return;
        const k = line.slice(0, i).trim().replace(/\./g, ' ').replace(/^\$/, '');
        const v = line.slice(i + 1).trim();
        if (k && v) out[k] = v;
      });
    return out;
  };

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await api.getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setProducts([]);
      setLoadError(e.message || 'Could not load products. Is the server running and are you signed in?');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (p) => {
    setEditing(p);
    const existingDetails = Array.isArray(p.variantDetails) && p.variantDetails.length > 0
      ? p.variantDetails
      : (p.variants || []).map((vName) => ({
          name: vName,
          badge: '',
          short: p.short || '',
          image: p.image || '',
          specs: p.specs || {},
        }));

    setForm({
      name: p.name || '',
      short: p.short || '',
      image: p.image || '',
      specsText: specsToText(p.specs),
      categories: Array.isArray(p.categories) ? p.categories : [],
      variantItems: existingDetails.map((vd) => ({
        name: vd.name || '',
        badge: vd.badge || '',
        short: vd.short || '',
        image: vd.image || '',
        specsText: specsToText(vd.specs),
      })),
      isActive: p.isActive !== false,
    });
    setModalOpen(true);
  };

  const toggleCategory = (c) =>
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(c) ? prev.categories.filter((x) => x !== c) : [...prev.categories, c],
    }));

  const updateVariantField = (idx, field, value) => {
    setForm((prev) => {
      const next = [...prev.variantItems];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, variantItems: next };
    });
  };

  const addVariantItem = () => {
    setForm((prev) => ({
      ...prev,
      variantItems: [
        ...prev.variantItems,
        {
          name: '',
          badge: '',
          short: prev.short || '',
          image: prev.image || '',
          specsText: prev.specsText || '',
        },
      ],
    }));
  };

  const removeVariantItem = (idx) => {
    setForm((prev) => ({
      ...prev,
      variantItems: prev.variantItems.filter((_, i) => i !== idx),
    }));
  };

  const uploadVariantFile = async (idx, fileToUpload) => {
    setVariantUploadIdx(idx);
    setUploadPct(0);
    try {
      const { url } = await api.upload(fileToUpload, setUploadPct);
      updateVariantField(idx, 'image', url);
    } catch (er) {
      alert('Variant photo upload failed: ' + er.message);
    }
    setUploadPct(null);
    setVariantUploadIdx(null);
  };

  const handleVariantUpload = (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropRequest({
      fileOrUrl: file,
      target: idx,
      title: `Crop & Preview Type Photo (#${idx + 1})`,
    });
    e.target.value = '';
  };

  const toggleActive = async (p) => {
    try {
      await api.updateProduct(p._id, { isActive: p.isActive === false });
      await load();
    } catch (er) {
      alert('Could not change visibility: ' + er.message);
    }
  };

  const uploadMainProductFile = async (fileToUpload) => {
    setVariantUploadIdx(null);
    setUploadPct(0);
    try {
      const { url } = await api.upload(fileToUpload, setUploadPct);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (er) {
      alert('Upload failed: ' + er.message);
    }
    setUploadPct(null);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropRequest({
      fileOrUrl: file,
      target: 'main',
      title: `Crop & Preview Product Image — ${form.name || 'Product'}`,
    });
    e.target.value = '';
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!editing?._id) return;
    setBusy(true);
    try {
      const { specsText, variantItems, ...rest } = form;
      const cleanVariantDetails = (variantItems || [])
        .map((v) => ({
          name: String(v.name || '').trim(),
          badge: String(v.badge || '').trim(),
          short: String(v.short || '').trim(),
          image: String(v.image || '').trim(),
          specs: textToSpecs(v.specsText),
        }))
        .filter((v) => v.name);

      const payload = {
        ...rest,
        specs: textToSpecs(specsText),
        variants: cleanVariantDetails.map((v) => v.name),
        variantDetails: cleanVariantDetails,
      };
      await api.updateProduct(editing._id, payload);
      setModalOpen(false);
      await load();
    } catch (er) {
      alert('Failed to save product: ' + er.message);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-shell-900">Products Catalog</h2>
          <p className="text-sm text-shell-600">
            Update the details, main photo, categories, and individual type photos &amp; specifications for each product.
          </p>
        </div>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-shell-500">Loading products...</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, idx) => (
            <div
              key={p._id || p.id || idx}
              className="flex flex-col justify-between rounded-2xl border border-shell-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="h-44 w-full overflow-hidden rounded-xl bg-shell-100">
                  <img
                    src={p.image || '/images/block.jpg'}
                    alt={p.name}
                    className={`h-full w-full object-cover ${p.isActive === false ? 'opacity-50 grayscale' : ''}`}
                    onError={(e) => {
                      e.currentTarget.src = '/images/block.jpg';
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-leaf-800">
                    Product #{p.order ?? idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-shell-500">
                    {(p.variantDetails || p.variants || []).length} clickable types
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-shell-900">{p.name}</h3>
                {(p.categories || []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.categories.map((c) => (
                      <span key={c} className="rounded-full bg-leaf-50 px-2 py-0.5 text-[10px] font-bold text-leaf-800 border border-leaf-200">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-xs text-shell-600 line-clamp-3 leading-relaxed">{p.short}</p>
                {(p.variants || []).length > 0 && (
                  <p className="mt-2 text-[11px] text-shell-500">
                    <span className="font-semibold text-shell-700">Types:</span> {p.variants.join(' · ')}
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-shell-100 pt-3">
                <button
                  onClick={() => toggleActive(p)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                    p.isActive !== false
                      ? 'bg-leaf-100 text-leaf-800 hover:bg-leaf-200'
                      : 'bg-shell-100 text-shell-600 hover:bg-shell-200'
                  }`}
                  title={p.isActive !== false ? 'Click to hide from the website' : 'Click to publish on the website'}
                >
                  {p.isActive !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                  {p.isActive !== false ? 'Live on site' : 'Hidden'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-1.5 rounded-lg border border-shell-200 px-3 py-2 text-xs font-bold text-shell-700 hover:bg-shell-50"
                    title="Edit product & variant details"
                  >
                    <Edit3 size={14} /> Edit details &amp; types
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-shell-100 pb-4">
              <h3 className="font-head text-xl font-bold text-shell-900">
                {editing ? `Edit: ${editing.name}` : 'Edit Product'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-shell-400 hover:bg-shell-100 hover:text-shell-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Product Name *
                </label>
                <input
                  required
                  className={inputCls}
                  placeholder="e.g. Coir Pith 5kg Block"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Categories (select one or more)
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.map((c) => {
                    const on = form.categories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCategory(c)}
                        aria-pressed={on}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                          on
                            ? 'border-leaf-600 bg-leaf-600 text-white shadow-sm'
                            : 'border-shell-300 bg-white text-shell-700 hover:border-leaf-400 hover:bg-leaf-50'
                        }`}
                      >
                        {on ? '✓ ' : ''}{c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Main Short Description *
                </label>
                <textarea
                  required
                  rows={3}
                  className={inputCls}
                  placeholder="Summary of specs, expansion ratio, and ideal horticultural use..."
                  value={form.short}
                  onChange={(e) => setForm({ ...form, short: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Main Product Image
                </label>
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    placeholder="Image URL or upload file below"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUpload}
                  />
                  <button
                    type="button"
                    disabled={uploadPct !== null}
                    onClick={() => fileRef.current.click()}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-shell-300 bg-shell-100 px-3.5 py-2 text-xs font-bold text-shell-800 hover:bg-shell-200 disabled:opacity-50"
                  >
                    <Upload size={14} /> Upload &amp; Crop
                  </button>
                  {form.image && (
                    <button
                      type="button"
                      disabled={uploadPct !== null}
                      onClick={() =>
                        setCropRequest({
                          fileOrUrl: form.image,
                          target: 'main',
                          title: `Crop & Preview Product Image — ${form.name || 'Product'}`,
                        })
                      }
                      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-leaf-300 bg-leaf-50 px-3 py-2 text-xs font-bold text-leaf-800 hover:bg-leaf-100 disabled:opacity-50"
                      title="Crop & preview current product image"
                    >
                      <Crop size={14} /> Crop View
                    </button>
                  )}
                </div>
                {uploadPct !== null && variantUploadIdx === null && (
                  <div className="mt-3 flex justify-center">
                    <GrowLoader overlay={false} progress={uploadPct} label="Uploading image" />
                  </div>
                )}
                {form.image && (uploadPct === null || variantUploadIdx !== null) && (
                  <div className="mt-2 h-24 w-36 overflow-hidden rounded-xl border border-shell-200">
                    <img src={form.image} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Default Specifications (one per line, "Label: value")
                </label>
                <textarea
                  rows={5}
                  className={`${inputCls} font-mono text-xs`}
                  placeholder={'Block: 30 × 30 × 10 cm, 5 kg\npH: 5.5 – 6.5'}
                  value={form.specsText}
                  onChange={(e) => setForm({ ...form, specsText: e.target.value })}
                />
              </div>

              {/* CLICKABLE PRODUCT TYPES / VARIANTS EDITOR */}
              <div className="rounded-2xl border border-leaf-200 bg-leaf-50/40 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-head text-base font-bold text-shell-900">
                      Clickable Product Types (Image, Description &amp; Specs per Type)
                    </h4>
                    <p className="text-xs text-shell-600">
                      When a visitor clicks a type on the Products page, its photo, description, and specification table switch automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantItem}
                    className="flex items-center gap-1.5 rounded-xl bg-leaf-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-leaf-800"
                  >
                    <Plus size={14} /> Add Type
                  </button>
                </div>

                {form.variantItems.length === 0 ? (
                  <p className="text-xs text-shell-500 italic">
                    No product types added yet. Click &ldquo;Add Type&rdquo; above to add one.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {form.variantItems.map((vItem, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-shell-200 bg-white p-4 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-shell-100 pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-leaf-800">
                            Type #{idx + 1}: {vItem.name || 'Untitled Type'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVariantItem(idx)}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-shell-600">
                              Type Name *
                            </label>
                            <input
                              required
                              className={inputCls}
                              placeholder="e.g. 5 kg Low EC Coir Pith Block"
                              value={vItem.name}
                              onChange={(e) => updateVariantField(idx, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-shell-600">
                              Highlight Badge (Optional)
                            </label>
                            <input
                              className={inputCls}
                              placeholder="e.g. Low EC — Washed"
                              value={vItem.badge}
                              onChange={(e) => updateVariantField(idx, 'badge', e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-shell-600">
                            Type Photo (shown when clicked)
                          </label>
                          <div className="flex gap-2">
                            <input
                              className={inputCls}
                              placeholder="Image URL or click Upload"
                              value={vItem.image}
                              onChange={(e) => updateVariantField(idx, 'image', e.target.value)}
                            />
                            <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-shell-300 bg-shell-100 px-3.5 py-2 text-xs font-bold text-shell-800 hover:bg-shell-200">
                              <Upload size={14} /> Upload &amp; Crop
                              <input
                                type="file"
                                hidden
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => handleVariantUpload(idx, e)}
                              />
                            </label>
                            {vItem.image && (
                              <button
                                type="button"
                                onClick={() =>
                                  setCropRequest({
                                    fileOrUrl: vItem.image,
                                    target: idx,
                                    title: `Crop & Preview Type Photo — ${vItem.name || `#${idx + 1}`}`,
                                  })
                                }
                                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-leaf-300 bg-leaf-50 px-3 py-2 text-xs font-bold text-leaf-800 hover:bg-leaf-100"
                                title="Crop & preview this type photo"
                              >
                                <Crop size={14} /> Crop View
                              </button>
                            )}
                          </div>
                          {uploadPct !== null && variantUploadIdx === idx && (
                            <div className="mt-2 flex justify-center">
                              <GrowLoader overlay={false} progress={uploadPct} label="Uploading type photo" />
                            </div>
                          )}
                          {vItem.image && (
                            <div className="mt-2 h-20 w-28 overflow-hidden rounded-xl border border-shell-200">
                              <img src={vItem.image} alt="" className="h-full w-full object-cover" />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-shell-600">
                            Type Description
                          </label>
                          <textarea
                            rows={2}
                            className={inputCls}
                            placeholder="Description shown when this type is selected..."
                            value={vItem.short}
                            onChange={(e) => updateVariantField(idx, 'short', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-shell-600">
                            Type Specifications (one per line, "Label: value")
                          </label>
                          <textarea
                            rows={4}
                            className={`${inputCls} font-mono text-xs`}
                            placeholder={'Expansion: 16 L/kg (≈ 80 L per 5 kg block)\nEC: Less than 0.6 mS/cm'}
                            value={vItem.specsText}
                            onChange={(e) => updateVariantField(idx, 'specsText', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-shell-800">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-4 w-4 rounded text-leaf-600 focus:ring-leaf-500"
                  />
                  Visible and published on the website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-shell-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-shell-200 px-4 py-2 text-sm font-semibold text-shell-700 hover:bg-shell-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-leaf-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-leaf-700 disabled:opacity-50"
                >
                  {busy ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImageCropModal
        open={!!cropRequest}
        fileOrUrl={cropRequest?.fileOrUrl}
        title={cropRequest?.title || 'Crop & Preview Product Image'}
        defaultPreset="4:3"
        onCancel={() => setCropRequest(null)}
        onComplete={async (croppedFile) => {
          const target = cropRequest?.target;
          setCropRequest(null);
          if (target === 'main') {
            await uploadMainProductFile(croppedFile);
          } else if (typeof target === 'number') {
            await uploadVariantFile(target, croppedFile);
          }
        }}
      />
    </div>
  );
}

// -------------------------------------------------------------
// TAB 2B: INFRASTRUCTURE MANAGER (GALLERY OF PHOTOS & VIDEOS)
// -------------------------------------------------------------
function InfrastructureTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploadPct, setUploadPct] = useState(null);
  const [uploadLabel, setUploadLabel] = useState('Uploading media');
  const [loadError, setLoadError] = useState('');
  const [cropSource, setCropSource] = useState(null);
  const fileRef = useRef(null);

  const EMPTY_FORM = {
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    order: 1,
    isActive: true,
  };
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await api.getAllInfrastructure();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
      } else {
        setItems(DEFAULT_INFRASTRUCTURE);
      }
    } catch (e) {
      setItems(DEFAULT_INFRASTRUCTURE);
      setLoadError(e.message || 'Could not load infrastructure items from server.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      order: items.length + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      mediaUrl: item.mediaUrl || '',
      mediaType: item.mediaType === 'video' ? 'video' : 'image',
      order: item.order ?? 1,
      isActive: item.isActive !== false,
    });
    setModalOpen(true);
  };

  const uploadMediaFile = async (fileToUpload, isVid = false) => {
    const isLargeVideo = isVid && fileToUpload.size > 50 * 1024 * 1024;
    const mb = (fileToUpload.size / (1024 * 1024)).toFixed(1);
    setUploadLabel(
      isLargeVideo
        ? `Video is ${mb} MB (>50 MB limit) · Auto-compressing & uploading…`
        : isVid
        ? 'Uploading video'
        : 'Uploading image'
    );
    setUploadPct(0);
    try {
      const { url } = await api.upload(fileToUpload, setUploadPct);
      setForm((prev) => ({
        ...prev,
        mediaUrl: url,
        mediaType: isVid ? 'video' : 'image',
      }));
    } catch (er) {
      alert('Upload failed: ' + er.message);
    }
    setUploadPct(null);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVid = file.type.startsWith('video/');
    e.target.value = '';
    if (isVid) {
      await uploadMediaFile(file, true);
    } else {
      setCropSource(file);
    }
  };

  const toggleActive = async (item) => {
    if (!item._id) return;
    try {
      await api.updateInfrastructure(item._id, { isActive: item.isActive === false });
      await load();
    } catch (er) {
      alert('Could not update status: ' + er.message);
    }
  };

  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this photo/video from the Infrastructure gallery?')) return;
    try {
      await api.deleteInfrastructure(id);
      await load();
    } catch (er) {
      alert('Failed to delete: ' + er.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...form,
        category: '',
        order: Number(form.order) || 1,
      };
      if (editing && editing._id) {
        await api.updateInfrastructure(editing._id, payload);
      } else {
        await api.createInfrastructure(payload);
      }
      setModalOpen(false);
      await load();
    } catch (er) {
      alert('Failed to save item: ' + er.message);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-shell-900">Infrastructure Photo &amp; Video Gallery</h2>
          <p className="text-sm text-shell-600">
            Add, edit, or delete photos and videos displayed in your Infrastructure gallery.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-leaf-700"
        >
          <Plus size={16} /> Add Photo / Video
        </button>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-shell-500">Loading infrastructure gallery...</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => {
            const isVideo =
              item.mediaType === 'video' ||
              /\.(mp4|webm)$/i.test(item.mediaUrl || '') ||
              String(item.mediaUrl || '').includes('/video/upload/');

            return (
              <div
                key={item._id || idx}
                className="flex flex-col justify-between rounded-2xl border border-shell-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden rounded-xl bg-leaf-950">
                    {isVideo ? (
                      <video
                        src={item.mediaUrl}
                        controls
                        preload="metadata"
                        className={`h-full w-full object-cover ${item.isActive === false ? 'opacity-50 grayscale' : ''}`}
                      />
                    ) : (
                      <img
                        src={item.mediaUrl || '/images/factory.jpg'}
                        alt={item.title || `Gallery item ${idx + 1}`}
                        className={`h-full w-full object-cover ${item.isActive === false ? 'opacity-50 grayscale' : ''}`}
                        onError={(e) => {
                          e.currentTarget.src = '/images/factory.jpg';
                        }}
                      />
                    )}
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-leaf-950/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      {isVideo ? <Film size={11} /> : <ImageIcon size={11} />}
                      {isVideo ? 'Video' : 'Photo'}
                    </span>
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      #{item.order ?? idx + 1}
                    </span>
                  </div>

                  {item.title && (
                    <h3 className="mt-3 text-base font-bold text-shell-900">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="mt-1 text-xs text-shell-600 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-shell-100 pt-3">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                      item.isActive !== false
                        ? 'bg-leaf-100 text-leaf-800 hover:bg-leaf-200'
                        : 'bg-shell-100 text-shell-600 hover:bg-shell-200'
                    }`}
                  >
                    {item.isActive !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                    {item.isActive !== false ? 'Live' : 'Hidden'}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex items-center gap-1 rounded-lg border border-shell-200 px-3 py-1.5 text-xs font-bold text-shell-700 hover:bg-shell-50"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    {item._id && (
                      <button
                        onClick={() => remove(item._id)}
                        className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-shell-100 pb-4">
              <h3 className="font-head text-xl font-bold text-shell-900">
                {editing ? 'Edit Gallery Item' : 'Add Photo or Video to Gallery'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-shell-400 hover:bg-shell-100 hover:text-shell-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Photo or Video File / URL *
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    className={inputCls}
                    placeholder="Paste URL or click Upload (Images & MP4/WebM Videos)"
                    value={form.mediaUrl}
                    onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                    onChange={handleUpload}
                  />
                  <button
                    type="button"
                    disabled={uploadPct !== null}
                    onClick={() => fileRef.current.click()}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-shell-300 bg-shell-100 px-3.5 py-2 text-xs font-bold text-shell-800 hover:bg-shell-200 disabled:opacity-50"
                  >
                    <Upload size={14} /> Upload &amp; Crop
                  </button>
                  {form.mediaUrl && form.mediaType !== 'video' && (
                    <button
                      type="button"
                      disabled={uploadPct !== null}
                      onClick={() => setCropSource(form.mediaUrl)}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-leaf-300 bg-leaf-50 px-3 py-2 text-xs font-bold text-leaf-800 hover:bg-leaf-100 disabled:opacity-50"
                      title="Crop & preview this gallery photo"
                    >
                      <Crop size={14} /> Crop View
                    </button>
                  )}
                </div>
                {uploadPct !== null && (
                  <div className="mt-3 flex justify-center">
                    <GrowLoader overlay={false} progress={uploadPct} label={uploadLabel} />
                  </div>
                )}
                {form.mediaUrl && uploadPct === null && (
                  <div className="mt-2 h-32 w-48 overflow-hidden rounded-xl border border-shell-200 bg-black">
                    {form.mediaType === 'video' ? (
                      <video src={form.mediaUrl} controls className="h-full w-full object-cover" />
                    ) : (
                      <img src={form.mediaUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Media Type
                </label>
                <select
                  className={inputCls}
                  value={form.mediaType}
                  onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                >
                  <option value="image">Photo (Image)</option>
                  <option value="video">Video (MP4 / WebM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Title / Caption (Optional)
                </label>
                <input
                  className={inputCls}
                  placeholder="Optional title or caption for this photo/video"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  className={inputCls}
                  placeholder="Optional short description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 items-center">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </div>
                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-shell-800">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="h-4 w-4 rounded text-leaf-600 focus:ring-leaf-500"
                    />
                    Published on Infrastructure page
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-shell-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-shell-200 px-4 py-2 text-sm font-semibold text-shell-700 hover:bg-shell-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-leaf-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-leaf-700 disabled:opacity-50"
                >
                  {busy ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImageCropModal
        open={!!cropSource}
        fileOrUrl={cropSource}
        title="Crop & Preview Infrastructure Photo"
        defaultPreset="4:3"
        onCancel={() => setCropSource(null)}
        onComplete={async (croppedFile) => {
          setCropSource(null);
          await uploadMediaFile(croppedFile, false);
        }}
      />
    </div>
  );
}

// -------------------------------------------------------------
// TAB 3: BLOG POSTS (CRUD)
// -------------------------------------------------------------
function BlogsTab() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [cropSource, setCropSource] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    coverImage: '',
    author: 'HarWest Agronomy Team',
    readTime: '5 min read',
    isPublished: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getBlogs();
      if (Array.isArray(data) && data.length > 0) {
        setBlogs(data);
      } else {
        setBlogs(DEFAULT_BLOGS);
      }
    } catch {
      setBlogs(DEFAULT_BLOGS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      coverImage: '',
      author: 'HarWest Agronomy Team',
      readTime: '5 min read',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({
      title: b.title || '',
      slug: b.slug || '',
      summary: b.summary || '',
      content: b.content || '',
      coverImage: b.coverImage || '',
      author: b.author || 'HarWest Agronomy Team',
      readTime: b.readTime || '5 min read',
      isPublished: b.isPublished !== false,
    });
    setModalOpen(true);
  };

  const uploadBlogCoverFile = async (fileToUpload) => {
    setBusy(true);
    try {
      const { url } = await api.upload(fileToUpload);
      setForm((prev) => ({ ...prev, coverImage: url }));
    } catch (er) {
      alert('Upload failed: ' + er.message);
    }
    setBusy(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropSource(file);
    e.target.value = '';
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing && editing._id) {
        await api.updateBlog(editing._id, form);
      } else {
        await api.createBlog(form);
      }
      setModalOpen(false);
      await load();
    } catch (er) {
      alert('Failed to save blog post: ' + er.message);
    }
    setBusy(false);
  };

  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.deleteBlog(id);
      await load();
    } catch (er) {
      alert(er.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-shell-900">Articles & Blog Management</h2>
          <p className="text-sm text-shell-600">
            Publish educational articles on coco peat, low-EC washing, and hydroponics.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-leaf-700"
        >
          <Plus size={16} /> Write New Article
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-shell-500">Loading articles...</div>
      ) : (
        <div className="grid gap-4">
          {blogs.map((b, idx) => (
            <div
              key={b._id || b.slug || idx}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-shell-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-shell-100">
                  <img
                    src={b.coverImage || '/images/block.jpg'}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/block.jpg';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-shell-400">
                      {b.publishedAt || 'Recent'} · {b.readTime || '5 min read'}
                    </span>
                  </div>
                  <h3 className="font-head text-base font-bold text-shell-900 mt-1">{b.title}</h3>
                  <p className="text-xs text-shell-500 line-clamp-1 max-w-2xl">{b.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <a
                  href={`/blog/${b.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-shell-200 px-3 py-1.5 text-xs font-semibold text-shell-700 hover:bg-shell-50"
                  title="Preview post on site"
                >
                  <Eye size={14} /> View
                </a>
                <button
                  onClick={() => openEdit(b)}
                  className="rounded-lg border border-shell-200 p-2 text-shell-700 hover:bg-shell-50"
                  title="Edit post"
                >
                  <Edit3 size={15} />
                </button>
                {b._id && (
                  <button
                    onClick={() => remove(b._id)}
                    className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                    title="Delete post"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-shell-100 pb-4">
              <h3 className="font-head text-xl font-bold text-shell-900">
                {editing ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-shell-400 hover:bg-shell-100 hover:text-shell-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Article Title *
                </label>
                <input
                  required
                  className={inputCls}
                  placeholder="e.g. What to Check Before Buying Coco Peat Block for Sale"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Custom Slug (Optional)
                </label>
                <input
                  className={inputCls}
                  placeholder="e.g. buying-coco-peat-blocks"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Summary / Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  className={inputCls}
                  placeholder="Short introductory summary appearing on cards and search previews..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                      Article Content *
                    </label>
                    {/* Hover tooltip for formatting rules */}
                    <div className="group relative inline-flex items-center">
                      <span
                        tabIndex={0}
                        aria-label="Formatting help"
                        className="grid h-4 w-4 cursor-help place-items-center rounded-full bg-leaf-100 text-leaf-800 text-[10px] font-bold ring-1 ring-leaf-300 hover:bg-leaf-200 transition"
                      >
                        ?
                      </span>
                      <div className="pointer-events-none absolute left-0 bottom-full mb-2 hidden w-80 rounded-2xl bg-shell-900 p-4 text-xs text-white shadow-2xl group-hover:block group-focus:block z-50 border border-shell-700 animate-fadeIn">
                        <p className="font-head text-xs font-bold text-coconut-300 tracking-wide uppercase mb-2">
                          Formatting Rules
                        </p>
                        <div className="space-y-1.5 font-mono text-[11px] text-shell-200">
                          <div>
                            <span className="text-leaf-400 font-bold"># Main Heading</span> (Large title)
                          </div>
                          <div>
                            <span className="text-leaf-400 font-bold">## Subheading</span> (Section break)
                          </div>
                          <div>
                            <span className="text-leaf-400 font-bold">### Subsection</span> (Topic header)
                          </div>
                          <div>
                            <span className="text-leaf-400 font-bold">**bold text**</span> or <span className="text-leaf-400 font-bold">*italic*</span>
                          </div>
                          <div>
                            <span className="text-leaf-400 font-bold">- Bullet item</span> (Unordered list)
                          </div>
                          <div>
                            <span className="text-leaf-400 font-bold">1. Numbered item</span>
                          </div>
                        </div>
                        <p className="mt-3 border-t border-shell-800 pt-2 font-sans text-[11px] text-shell-300 leading-relaxed">
                          Separate regular content and paragraphs with a blank empty line.
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-shell-400">Supports Markdown (#, ##, ###)</span>
                </div>
                <textarea
                  required
                  rows={9}
                  className={`${inputCls} font-mono text-xs leading-relaxed`}
                  placeholder={'# Introduction to Coir\n\nCoco peat is an exceptional substrate...\n\n## Key Benefits\n\n- Low EC under 0.5 mS/cm\n- Retains 8x its weight in water\n\n### Field Guidelines\n\nAlways verify electrical conductivity before planting.'}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    placeholder="/images/... or https://res.cloudinary.com/..."
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleUpload}
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => fileRef.current.click()}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-shell-300 bg-shell-100 px-3.5 py-2 text-xs font-bold text-shell-800 hover:bg-shell-200"
                  >
                    <Upload size={14} /> Upload &amp; Crop
                  </button>
                  {form.coverImage && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setCropSource(form.coverImage)}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-leaf-300 bg-leaf-50 px-3 py-2 text-xs font-bold text-leaf-800 hover:bg-leaf-100"
                      title="Crop & preview article cover image"
                    >
                      <Crop size={14} /> Crop View
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                    Author
                  </label>
                  <input
                    className={inputCls}
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                    Read Time
                  </label>
                  <input
                    className={inputCls}
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-shell-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-shell-200 px-4 py-2 text-sm font-semibold text-shell-700 hover:bg-shell-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-leaf-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-leaf-700 disabled:opacity-50"
                >
                  {busy ? 'Saving...' : editing ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImageCropModal
        open={!!cropSource}
        fileOrUrl={cropSource}
        title="Crop & Preview Article Cover Image"
        defaultPreset="16:9"
        onCancel={() => setCropSource(null)}
        onComplete={async (croppedFile) => {
          setCropSource(null);
          await uploadBlogCoverFile(croppedFile);
        }}
      />
    </div>
  );
}

// -------------------------------------------------------------
// TAB 4: FAQS MANAGER (CRUD)
// -------------------------------------------------------------
function FaqsTab() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getFaqs();
      if (Array.isArray(data) && data.length > 0) {
        setFaqs(data);
      } else {
        setFaqs(FALLBACK_FAQS.map((f, i) => ({ ...f, question: f.q, answer: f.a, order: i + 1 })));
      }
    } catch {
      setFaqs(FALLBACK_FAQS.map((f, i) => ({ ...f, question: f.q, answer: f.a, order: i + 1 })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({
      question: '',
      answer: '',
      category: 'General',
      order: faqs.length + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setForm({
      question: f.question || f.q || '',
      answer: f.answer || f.a || '',
      category: f.category || 'General',
      order: f.order || 0,
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing && editing._id) {
        await api.updateFaq(editing._id, form);
      } else {
        await api.createFaq(form);
      }
      setModalOpen(false);
      await load();
    } catch (er) {
      alert('Failed to save FAQ: ' + er.message);
    }
    setBusy(false);
  };

  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this FAQ question?')) return;
    try {
      await api.deleteFaq(id);
      await load();
    } catch (er) {
      alert(er.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-shell-900">Frequently Asked Questions (FAQ)</h2>
          <p className="text-sm text-shell-600">
            Manage the FAQ questions displayed on the Homepage and Quality page.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-leaf-700"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-shell-500">Loading FAQs...</div>
      ) : (
        <div className="grid gap-4">
          {faqs.map((f, idx) => (
            <div
              key={f._id || idx}
              className="rounded-2xl border border-shell-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-shell-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-shell-700">
                    {f.category || 'General'}
                  </span>
                  <h3 className="mt-2 font-head text-base font-bold text-shell-900">
                    {f.question || f.q}
                  </h3>
                  <p className="mt-2 text-sm text-shell-600 leading-relaxed whitespace-pre-wrap">
                    {f.answer || f.a}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(f)}
                    className="rounded-lg border border-shell-200 p-2 text-shell-700 hover:bg-shell-50"
                    title="Edit FAQ"
                  >
                    <Edit3 size={15} />
                  </button>
                  {f._id && (
                    <button
                      onClick={() => remove(f._id)}
                      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      title="Delete FAQ"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-shell-100 pb-4">
              <h3 className="font-head text-xl font-bold text-shell-900">
                {editing ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-shell-400 hover:bg-shell-100 hover:text-shell-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Question *
                </label>
                <input
                  required
                  className={inputCls}
                  placeholder="e.g. What is the difference between washed and buffered coir?"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                    Category
                  </label>
                  <select
                    className={inputCls}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Quality">Quality</option>
                    <option value="Technical">Technical</option>
                    <option value="Usage">Usage</option>
                    <option value="Export">Export</option>
                    <option value="Customization">Customization</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                    Order Index
                  </label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
                  Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  className={inputCls}
                  placeholder="Provide clear technical answers for prospective commercial growers..."
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-shell-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-shell-200 px-4 py-2 text-sm font-semibold text-shell-700 hover:bg-shell-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-xl bg-leaf-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-leaf-700 disabled:opacity-50"
                >
                  {busy ? 'Saving...' : editing ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// TAB 5: MEDIA & BRANDING OVERRIDES
// -------------------------------------------------------------
function readVideoSize(file) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    const objUrl = URL.createObjectURL(file);
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      resolve([v.videoWidth, v.videoHeight]);
      URL.revokeObjectURL(objUrl);
    };
    v.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(objUrl);
    };
    v.src = objUrl;
  });
}

function MediaCard({ id, meta, current, overridden, onChanged }) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);
  const [uploadLabel, setUploadLabel] = useState(meta.type === 'video' ? 'Uploading video' : 'Uploading image');
  const [msg, setMsg] = useState('');
  const [cropSource, setCropSource] = useState(null);
  const fileRef = useRef(null);
  const isLogo = id === 'branding.logo';
  const isVideo = meta.type === 'video';

  const run = async (fn, ok) => {
    setBusy(true);
    setMsg('');
    try {
      await fn();
      setMsg(ok);
      await onChanged();
    } catch (e) {
      setMsg(e.message);
    }
    setProgress(null);
    setBusy(false);
  };

  const uploadMediaFile = async (file) => {
    if (meta.size && isVideo) {
      const dims = await readVideoSize(file);
      const [w, h] = meta.size;
      if (dims && (dims[0] !== w || dims[1] !== h)) {
        const ok = window.confirm(
          `This video is ${dims[0]}×${dims[1]}, but this slot is designed for ${w}×${h}. It will be cropped to fit. Upload anyway?`
        );
        if (!ok) return;
      }
    }
    const isLargeVideo = isVideo && file.size > 50 * 1024 * 1024;
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadLabel(
      isLargeVideo
        ? `Video is ${mb} MB (>50 MB limit) · Auto-compressing & uploading…`
        : isVideo
        ? 'Uploading video'
        : 'Uploading image'
    );
    setProgress(0);
    run(async () => {
      const { url: u } = await api.upload(file, setProgress);
      setProgress(100);
      await api.setMedia(id, u);
    }, isLargeVideo ? 'Uploaded! High-res video was automatically compressed to web HD.' : 'Uploaded & applied to live website!');
  };

  const handleFile = async (file) => {
    if (isVideo) {
      await uploadMediaFile(file);
    } else {
      setCropSource(file);
    }
  };

  return (
    <div className="relative space-y-3 rounded-2xl bg-white p-4 shadow-sm border border-shell-200">
      {busy && (
        <GrowLoader
          progress={progress}
          label={progress === null ? 'Saving…' : uploadLabel}
        />
      )}
      <div className={`w-full overflow-hidden rounded-xl ${meta.size ? 'aspect-video bg-shell-100' : isLogo ? 'h-28 bg-leaf-950 p-4 flex items-center justify-center' : 'h-36 bg-shell-100'}`}>
        {isVideo ? (
          <video src={current} controls muted className="h-full w-full bg-black object-cover" />
        ) : (
          <img
            src={current}
            alt=""
            className={
              isLogo
                ? 'max-h-16 w-auto max-w-[210px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                : 'h-full w-full object-cover'
            }
          />
        )}
      </div>

      <div>
        <p className="font-semibold text-shell-900">{meta.label}</p>
        <p className="text-xs text-shell-500">
          {id}{' '}
          {overridden && (
            <span className="ml-1 rounded bg-leaf-100 px-1.5 text-leaf-700 font-semibold">customized</span>
          )}
        </p>
        {meta.resolution && (
          <div className="mt-2 rounded-xl border border-leaf-200 bg-leaf-50/90 px-3 py-2 text-[11px] font-semibold leading-relaxed text-leaf-900">
            📐 {meta.resolution}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className={inputCls}
          placeholder="https://... URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          disabled={busy || !url}
          onClick={() =>
            run(async () => {
              await api.setMedia(id, url);
              setUrl('');
            }, 'Saved')
          }
          className="rounded-xl bg-leaf-600 px-3 text-white disabled:opacity-40"
          title="Save URL"
        >
          <Link2 size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          hidden
          accept={isVideo ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp'}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
        <button
          disabled={busy}
          onClick={() => fileRef.current.click()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-shell-800 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-shell-900 disabled:opacity-40"
        >
          <Upload size={14} /> {isVideo ? 'Upload Video' : 'Upload & Crop'}
        </button>
        {!isVideo && current && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setCropSource(current)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-leaf-300 bg-leaf-50 px-3 py-2 text-xs font-bold text-leaf-800 transition hover:bg-leaf-100 disabled:opacity-40"
            title="Crop & preview how this image looks on the website"
          >
            <Crop size={14} /> Crop View
          </button>
        )}
        {overridden && (
          <button
            disabled={busy}
            onClick={() => run(() => api.resetMedia(id), 'Reset to default')}
            className="flex items-center gap-1 rounded-xl border border-shell-300 px-3 py-2 text-sm hover:bg-shell-50"
            title="Reset to default"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      {msg && <p className="text-xs text-shell-600">{msg}</p>}

      {!isVideo && (
        <ImageCropModal
          open={!!cropSource}
          fileOrUrl={cropSource}
          title={
            isLogo
              ? 'Crop & Preview Website Logo (Live Navbar View)'
              : `Crop & Preview — ${meta.label}`
          }
          defaultPreset={isLogo ? 'logo' : id.startsWith('hero.') ? '16:9' : '4:3'}
          isLogo={isLogo}
          onCancel={() => setCropSource(null)}
          onComplete={async (croppedFile) => {
            setCropSource(null);
            await uploadMediaFile(croppedFile);
          }}
        />
      )}
    </div>
  );
}

function MediaTab() {
  const { overrides, refresh, get } = useMedia();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-shell-900">Media, Logo & Hero Assets</h2>
        <p className="text-sm text-shell-600">
          Upload replacement assets stored directly in Cloudinary or local storage. Changes reflect instantaneously across all visitors.
        </p>
      </div>

      {Object.entries(ASSET_GROUPS).map(([g, title]) => (
        <section key={g} className="space-y-4">
          <h3 className="font-head text-lg font-bold text-leaf-800 border-b border-shell-200 pb-2">
            {title}
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(ASSET_DEFAULTS)
              .filter(([id]) => id.startsWith(g + '.'))
              .map(([id, meta]) => (
                <MediaCard
                  key={id}
                  id={id}
                  meta={meta}
                  current={get(id)}
                  overridden={!!overrides[id]}
                  onChanged={refresh}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// TAB 6: SECURITY & SETTINGS
// -------------------------------------------------------------
function SecurityTab({ email }) {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState('');
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    api.health().then(setHealthStatus).catch(() => setHealthStatus({ ok: false, database: 'disconnected' }));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.changePassword(cur, next);
      setMsg('Password updated successfully. Other active sessions were invalidated.');
      setCur('');
      setNext('');
    } catch (er) {
      setMsg(er.message);
    }
  };

  const isDbConnected = healthStatus?.database === 'connected';

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-shell-900">System Diagnostics & Account Security</h2>
        <p className="text-sm text-shell-600">
          Verify database connections, storage providers, and update admin credentials.
        </p>
      </div>

      {/* Database Status Card */}
      <div className="rounded-2xl border border-shell-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-head text-lg font-bold text-shell-900">
          <Database size={18} className="text-leaf-600" /> Database Connection
        </h3>
        <div className="mt-4 flex items-center gap-3">
          <span
            className={`h-3 w-3 rounded-full ${
              isDbConnected ? 'bg-leaf-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="font-semibold text-sm text-shell-800">
            {isDbConnected ? 'MongoDB Atlas is Connected' : 'MongoDB Atlas is Not Connected Yet'}
          </span>
        </div>
        <p className="mt-2 text-xs text-shell-600 leading-relaxed">
          {isDbConnected
            ? 'All customer enquiries, blog posts, FAQs, and product items are securely synchronized with your MongoDB Atlas cluster.'
            : 'To save customer leads to MongoDB, paste your MongoDB Atlas URI into server/.env (e.g. MONGODB_URI=mongodb+srv://...). See below for step-by-step instructions.'}
        </p>
      </div>

      {/* Change Password Form */}
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-shell-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-head text-lg font-bold text-shell-900">
          <KeyRound size={18} className="text-leaf-600" /> Change Administrator Password
        </h3>
        <p className="text-xs text-shell-500">Logged in as {email}</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
              Current Password
            </label>
            <input
              required
              className={inputCls}
              type="password"
              autoComplete="current-password"
              placeholder="Enter current password"
              value={cur}
              onChange={(e) => setCur(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
              New Password (min 12 characters)
            </label>
            <input
              required
              className={inputCls}
              type="password"
              autoComplete="new-password"
              placeholder="Enter new strong password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
        </div>
        <button className="rounded-xl bg-leaf-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-leaf-700">
          Update Password
        </button>
        {msg && <p className="text-sm font-medium text-leaf-700">{msg}</p>}
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// DASHBOARD CONTAINER WITH TABS
// -------------------------------------------------------------
function Dashboard({ email, onLogout }) {
  const [tab, setTab] = useState('enquiries');

  const tabs = [
    { key: 'enquiries', label: 'Enquiries', icon: Inbox },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'infrastructure', label: 'Infrastructure', icon: Building2 },
    { key: 'blogs', label: 'Blog Articles', icon: FileText },
    { key: 'faqs', label: 'FAQs', icon: HelpCircle },
    { key: 'media', label: 'Media & Branding', icon: ImageIcon },
    { key: 'security', label: 'Security & Database', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-shell-50">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-shell-200/80 bg-white/90 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-800 text-white font-bold text-lg shadow">
              HW
            </div>
            <div>
              <h1 className="font-head text-lg font-bold text-shell-900 leading-none">
                HarWest Administration
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-shell-500">
                <ShieldCheck size={13} className="text-leaf-600" /> Signed in as{' '}
                <span className="font-semibold text-shell-700">{email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-shell-200 px-3.5 py-2 text-xs font-semibold text-shell-700 hover:bg-shell-50"
            >
              <ExternalLink size={14} /> View Live Website
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-xl bg-shell-100 px-3.5 py-2 text-xs font-semibold text-shell-800 transition hover:bg-shell-200"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mx-auto mt-4 flex max-w-7xl overflow-x-auto gap-2 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                  active
                    ? 'bg-leaf-700 text-white shadow-sm'
                    : 'bg-transparent text-shell-600 hover:bg-shell-100'
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {tab === 'enquiries' && <EnquiriesTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'infrastructure' && <InfrastructureTab />}
        {tab === 'blogs' && <BlogsTab />}
        {tab === 'faqs' && <FaqsTab />}
        {tab === 'media' && <MediaTab />}
        {tab === 'security' && <SecurityTab email={email} />}
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// LOGIN SCREEN
// -------------------------------------------------------------
function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await api.login(email, password);
      onDone(email);
    } catch (er) {
      setErr(er.message);
    }
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-leaf-950 px-6 py-12">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 md:p-10 shadow-2xl border border-leaf-900/40">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-leaf-700 text-white font-bold text-2xl shadow-lg">
            HW
          </div>
          <h1 className="mt-4 font-head text-2xl font-bold text-shell-900">HarWest Admin Portal</h1>
          <p className="mt-1 text-xs text-shell-500">
            Sign in to manage enquiries, export catalog, blogs, FAQs, and branding assets.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
              Admin Email
            </label>
            <input
              required
              type="email"
              autoComplete="username"
              placeholder="admin@harwest.example"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-shell-700">
              Password
            </label>
            <input
              required
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {err && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-leaf-600 py-3 font-semibold text-white shadow-lg transition hover:bg-leaf-700 disabled:opacity-50"
          >
            {busy ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="rounded-xl bg-shell-50 p-3.5 text-[11px] text-shell-600 border border-shell-200/80">
          <p className="font-semibold text-shell-800">Initial Setup Instructions:</p>
          <p className="mt-1">
            To create your admin credentials, set <code className="text-leaf-800">ADMIN_EMAIL</code> and <code className="text-leaf-800">ADMIN_PASSWORD</code> in <code className="text-leaf-800">server/.env</code> and run <code className="text-leaf-800 font-bold">npm run seed:admin</code> in the server folder.
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN ADMIN ROOT
// -------------------------------------------------------------
export default function Admin() {
  const [state, setState] = useState({ loading: true, email: null });

  useEffect(() => {
    document.title = 'Admin Dashboard | HarWest';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);

    api
      .me()
      .then((d) => setState({ loading: false, email: d.email }))
      .catch(() => setState({ loading: false, email: null }));

    return () => meta.remove();
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setState({ loading: false, email: null });
  }, []);

  if (state.loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-shell-50 text-shell-500 text-sm">
        Checking admin authentication...
      </div>
    );
  }

  return state.email ? (
    <Dashboard email={state.email} onLogout={logout} />
  ) : (
    <Login onDone={(email) => setState({ loading: false, email })} />
  );
}
