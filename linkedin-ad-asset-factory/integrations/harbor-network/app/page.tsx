"use client";

import Image from "next/image";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clapperboard,
  Ellipsis,
  FileText,
  Grid3X3,
  Home,
  ImageIcon,
  Lightbulb,
  MessageSquare,
  MoreHorizontal,
  Newspaper,
  PenLine,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  ThumbsUp,
  UsersRound,
  Video,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";
import GeneratedAdFeed from "./GeneratedAdFeed";

const AVATAR = "/images/harvey-avatar.jpg";

type MenuName = "network" | "jobs" | "notifications" | "me" | "business" | null;

type AvatarProps = {
  src?: string;
  alt?: string;
  size: number;
  className?: string;
  eager?: boolean;
};

type PostProps = {
  author: string;
  avatar: string;
  subtitle: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  reposts?: number;
  relationship?: string;
  tags?: string[];
  suggested?: boolean;
  followable?: boolean;
  children?: ReactNode;
};

function Avatar({ src = AVATAR, alt = "", size, className, eager = false }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={["avatarImage", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, flex: `0 0 ${size}px` }}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function NetworkMenu() {
  return (
    <div className="navPopover networkPopover" id="network-menu" role="dialog" aria-label="My Network menu">
      <div className="menuTitle"><b>Manage my network</b><button type="button">See all</button></div>
      <div className="menuStats">
        <a href="#connections"><UsersRound size={18} /><span>Connections</span><b>482</b></a>
        <a href="#following"><Sparkles size={18} /><span>People I follow</span><b>91</b></a>
        <a href="#groups"><Grid3X3 size={18} /><span>Groups</span><b>8</b></a>
        <a href="#events"><CalendarDays size={18} /><span>Events</span><b>4</b></a>
      </div>
      <div className="menuSectionLabel">Invitations</div>
      <div className="inviteRow">
        <Avatar src="/images/person-2.jpg" size={44} />
        <div><b>Leila Monroe</b><span>Design lead at Paper Moon Works</span></div>
        <button className="quietButton" type="button">Ignore</button><button className="outlineButton" type="button">Accept</button>
      </div>
      <div className="inviteRow">
        <Avatar src="/images/person-3.jpg" size={44} />
        <div><b>Mateo Brooks</b><span>Operations at Clover &amp; Compass</span></div>
        <button className="quietButton" type="button">Ignore</button><button className="outlineButton" type="button">Accept</button>
      </div>
    </div>
  );
}

function JobsMenu() {
  return (
    <div className="navPopover jobsPopover" id="jobs-menu" role="dialog" aria-label="Jobs menu">
      <div className="menuTitle"><b>Your job tools</b></div>
      <div className="jobTools">
        <a href="#saved-jobs"><Bookmark size={18} /><span><b>Saved jobs</b><small>12 roles</small></span></a>
        <a href="#preferences"><Settings size={18} /><span><b>Preferences</b><small>Hybrid · Product engineering</small></span></a>
        <a href="#interviews"><MessageSquare size={18} /><span><b>Interview prep</b><small>Practice your next conversation</small></span></a>
      </div>
      <div className="menuSectionLabel">Recommended for you</div>
      <a className="jobResult" href="#role"><span className="companyMark blue">CW</span><span><b>Frontend Engineer</b><small>Crankleaf Works · Austin, TX</small></span></a>
      <a className="jobResult" href="#role"><span className="companyMark green">KS</span><span><b>Product Developer</b><small>Kiteframe Studio · Chicago, IL</small></span></a>
      <button className="menuFooterButton" type="button">Show all jobs <ChevronRight size={15} /></button>
    </div>
  );
}

function NotificationsMenu({ unread, onRead }: { unread: number; onRead: () => void }) {
  const [tab, setTab] = useState("All");
  const notifications = [
    ["/images/person-1.jpg", "Jonah Bell viewed your profile after seeing your post.", "18m"],
    ["/images/person-2.jpg", "Leila Monroe commented: “That customer map is sharp.”", "1h"],
    ["/images/person-3.jpg", "Crankleaf Works posted a role matching your preferences.", "3h"],
  ];
  return (
    <div className="navPopover notificationsPopover" id="notifications-menu" role="dialog" aria-label="Notifications menu">
      <div className="menuTitle"><b>Notifications</b><button type="button" onClick={onRead}>Mark all as read</button></div>
      <div className="notificationTabs" role="tablist" aria-label="Notification filters">
        {["All", "My posts", "Mentions"].map((name) => (
          <button key={name} className={tab === name ? "selected" : ""} onClick={() => setTab(name)} type="button" role="tab" aria-selected={tab === name}>{name}</button>
        ))}
      </div>
      {notifications.map(([src, copy, time], index) => (
        <a className={`notificationRow ${index < unread ? "unread" : ""}`} href="#notification" key={copy}>
          <Avatar src={src} size={42} />
          <span><b>{copy}</b><small>{time}</small></span>
          <MoreHorizontal size={18} />
        </a>
      ))}
      <button className="menuFooterButton" type="button">View all notifications <ChevronRight size={15} /></button>
    </div>
  );
}

function MeMenu() {
  return (
    <div className="navPopover mePopover" id="me-menu" role="dialog" aria-label="Account menu">
      <div className="meSummary"><Avatar size={54} alt="Harvey Yang" eager /><div><b>Harvey Yang</b><span>Computer science graduate student</span></div></div>
      <button className="viewProfileButton" type="button">View Profile</button>
      <div className="accountLinks"><b>Account</b><a href="#settings">Settings &amp; Privacy</a><a href="#help">Help</a><a href="#language">Language</a></div>
      <div className="accountLinks"><b>Manage</b><a href="#activity">Posts &amp; Activity</a><a href="#jobs-account">Job Posting Account</a></div>
      <button className="signOutButton" type="button">Sign Out</button>
    </div>
  );
}

function BusinessMenu() {
  return (
    <div className="navPopover businessPopover" id="business-menu" role="dialog" aria-label="For Business menu">
      <div className="menuTitle"><b>For Business</b></div>
      <div className="businessGrid">
        <a href="#product"><span className="productIcon purple">S</span><b>Skill Studio</b><small>Build team capabilities</small></a>
        <a href="#product"><span className="productIcon blue">T</span><b>Talent Desk</b><small>Find the right people</small></a>
        <a href="#product"><span className="productIcon orange">C</span><b>Campaign Lab</b><small>Reach professional audiences</small></a>
        <a href="#product"><span className="productIcon green">L</span><b>Learning Hub</b><small>Courses for every role</small></a>
      </div>
      <div className="businessServices"><b>Business services</b><a href="#hire">Hire on Network</a><a href="#sell">Sell with Network</a><a href="#advertise">Advertise</a><a href="#page">Create a Company Page</a></div>
    </div>
  );
}

function Header() {
  const [activeMenu, setActiveMenu] = useState<MenuName>(null);
  const [unread, setUnread] = useState(3);

  function toggle(menu: Exclude<MenuName, null>) {
    setActiveMenu((current) => current === menu ? null : menu);
  }

  return (
    <>
      <header className="topbar">
        <div className="topbarInner">
          <a className="brand" href="#top" aria-label="Harbor Network home"><span>H</span><i aria-hidden="true" /></a>
          <label className="searchBox"><Search size={16} aria-hidden="true" /><input aria-label="Search" placeholder="Search" /></label>
          <nav className="primaryNav" aria-label="Primary navigation">
            <a className="navItem active" href="#top"><Home size={22} fill="currentColor" /><span>Home</span></a>
            <div className="navMenuSlot">
              <button className="navItem" type="button" onClick={() => toggle("network")} aria-expanded={activeMenu === "network"} aria-controls="network-menu"><UsersRound size={22} /><span>My Network</span></button>
              {activeMenu === "network" && <NetworkMenu />}
            </div>
            <div className="navMenuSlot">
              <button className="navItem" type="button" onClick={() => toggle("jobs")} aria-expanded={activeMenu === "jobs"} aria-controls="jobs-menu"><BriefcaseBusiness size={22} /><span>Jobs</span></button>
              {activeMenu === "jobs" && <JobsMenu />}
            </div>
            <a className="navItem" href="#messaging"><MessageSquare size={22} fill="currentColor" /><span>Messaging</span></a>
            <div className="navMenuSlot">
              <button className="navItem" type="button" onClick={() => toggle("notifications")} aria-expanded={activeMenu === "notifications"} aria-controls="notifications-menu">
                <span className="navIconWithBadge"><Bell size={22} fill="currentColor" />{unread > 0 && <b>{unread}</b>}</span><span>Notifications</span>
              </button>
              {activeMenu === "notifications" && <NotificationsMenu unread={unread} onRead={() => setUnread(0)} />}
            </div>
            <div className="navMenuSlot">
              <button className="navItem profileNav" type="button" onClick={() => toggle("me")} aria-expanded={activeMenu === "me"} aria-controls="me-menu"><Avatar size={24} alt="Harvey" eager /><span>Me <ChevronDown size={12} /></span></button>
              {activeMenu === "me" && <MeMenu />}
            </div>
            <div className="navMenuSlot businessSlot">
              <button className="navItem businessNav" type="button" onClick={() => toggle("business")} aria-expanded={activeMenu === "business"} aria-controls="business-menu"><Grid3X3 size={22} /><span>For Business <ChevronDown size={12} /></span></button>
              {activeMenu === "business" && <BusinessMenu />}
            </div>
            <a className="premiumLink" href="#premium">Try Premium for $0</a>
          </nav>
        </div>
      </header>
      {activeMenu && <button className="navScrim" type="button" aria-label="Close menu" onClick={() => setActiveMenu(null)} />}
    </>
  );
}

function LeftSidebar() {
  return (
    <aside className="leftRail" aria-label="Profile shortcuts">
      <section className="card profileCard">
        <div className="profileCover" />
        <Avatar className="profileAvatar" size={76} alt="Harvey Yang" eager />
        <div className="profileCopy">
          <h1>Harvey Yang <span className="verified">✓</span></h1>
          <p>Computer science graduate student exploring product engineering and finance</p>
          <span className="location">Lakebridge Polytechnic</span>
        </div>
      </section>
      <section className="card premiumPrompt" id="premium"><p>Get exclusive tools, connections with leaders, and more</p><a href="#premium"><span className="goldSquare" /> Try Premium for $0</a></section>
      <section className="card metricsCard"><a href="#views"><span>Profile viewers</span><b>33</b></a><a href="#impressions"><span>Post impressions</span><b>162</b></a></section>
      <section className="card shortcutCard"><a href="#saved"><Bookmark size={16} fill="currentColor" /> Saved items</a><a href="#groups"><UsersRound size={16} fill="currentColor" /> Groups</a><a href="#newsletters"><Newspaper size={16} /> Newsletters</a><a href="#events"><CalendarDays size={16} /> Events</a></section>
    </aside>
  );
}

function Composer({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="card composer" aria-label="Create a post">
      <div className="composerTop"><Avatar size={48} alt="Harvey" eager /><button onClick={onOpen} type="button">Start a post</button></div>
      <div className="composerActions"><button type="button" onClick={onOpen}><Video size={20} color="#378fe9" /> Video</button><button type="button" onClick={onOpen}><ImageIcon size={20} color="#5f9b41" /> Photo</button><button type="button" onClick={onOpen}><FileText size={20} color="#e16745" /> Write article</button></div>
    </section>
  );
}

function SortBar() {
  return <button className="sortBar" type="button"><span /><small>Sort by:</small> Top <ChevronDown size={13} /></button>;
}

function Reactions({ count }: { count: number }) {
  return <span className="reactionSummary"><i>👍</i><i>💡</i><i>♥</i>{count.toLocaleString()}</span>;
}

function Post({ author, avatar, subtitle, time, text, likes, comments, reposts = 4, relationship = "2nd", tags = ["#product", "#careers", "#community"], suggested, followable = true, children }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [commenting, setCommenting] = useState(false);
  return (
    <article className="card postCard">
      {suggested && <div className="suggestedLine"><span>Suggested</span><button type="button" aria-label="Dismiss suggestion"><X size={17} /></button></div>}
      <div className="postHeader">
        <Avatar src={avatar} size={48} />
        <div className="postIdentity"><h2>{author} <span>· {relationship}</span></h2><p>{subtitle}</p><p>{time} · <span aria-label="Visible to anyone">◉</span></p></div>
        {followable && <button className="followButton" onClick={() => setFollowing(!following)} type="button">{following ? <><Check size={17} /> Following</> : <><Plus size={18} /> Follow</>}</button>}
        <button className="iconButton" type="button" aria-label="More post actions"><MoreHorizontal size={21} /></button>
      </div>
      <div className="postText">
        <p className={expanded ? "expanded" : "clamped"}>{text}</p>
        {text.length > 160 && <button onClick={() => setExpanded(!expanded)} type="button">{expanded ? "less" : "…more"}</button>}
        <a href="#topic">{tags.map((tag, index) => <span className="postTag" key={tag}>{tag}{index < tags.length - 1 ? " " : ""}</span>)}</a>
      </div>
      {children}
      <div className="engagementRow"><Reactions count={likes + (liked ? 1 : 0)} /><span>{comments} comments · {reposts} reposts</span></div>
      <div className="postActions"><button className={liked ? "liked" : ""} onClick={() => setLiked(!liked)} type="button"><ThumbsUp size={20} fill={liked ? "currentColor" : "none"} /> Like</button><button onClick={() => setCommenting(!commenting)} type="button"><MessageSquare size={20} /> Comment</button><button type="button"><Send size={20} /> Send</button></div>
      {commenting && <div className="commentBox"><Avatar size={32} /><input autoFocus aria-label="Add a comment" placeholder="Add a comment…" /></div>}
    </article>
  );
}

function WaffleAtlasMedia() {
  return (
    <div className="waffleAtlasMedia" role="img" aria-label="Waffle Atlas colorful product studio graphic">
      <div className="glow one" /><div className="glow two" /><div className="glow three" />
      <span>PRODUCT STUDIO · CHICAGO</span><strong>WAFFLE ATLAS</strong><small>Ideas, built in public.</small>
    </div>
  );
}

function MossMeteorMedia() {
  return (
    <div className="mossMeteorMedia">
      <Image src="/images/hands.jpg" alt="Friends making plans together" fill sizes="555px" />
      <div className="mossMeteorShade" /><div className="mossMeteorLogo">MOSS &amp; METEOR</div>
      <div className="mossMeteorHeadline">MAKE ROOM FOR<br /><b>BETTER WEEKENDS.</b></div>
      <div className="mossMeteorFooter"><b>$180 WELLBEING CREDIT</b><span>One membership for classes, getaways, and slow Sundays.</span></div>
    </div>
  );
}

function HandoffMedia() {
  return (
    <div className="handoffMedia">
      <p className="handoffEyebrow">THE HANDOFF GAP:</p><strong>$180K–$620K/YR</strong>
      <p>estimated value lost when a company&apos;s<br />know-how lives with one person.</p>
      <div className="handoffComparison"><span>Founder-held process: 36% documented.</span><div className="barRow"><i className="bar dark" /><b>→</b><em>THE<br />TRANSFER GAP.</em></div><span>Team-owned process: 84% documented.</span><i className="bar purple" /></div>
      <small>Comment MAP for the worksheet.</small>
    </div>
  );
}

function CrankleafMedia() {
  return (
    <div className="crankleafMedia">
      <Settings className="gear" size={210} strokeWidth={3.5} />
      <div className="crankleafLine">Build machines<br />people trust.<br /><b>Join Crankleaf.</b></div>
      <div className="crankleafRole">Automation Engineer<br /><b>$145K/year</b><br />Austin, TX<br />◆ Crankleaf Works</div>
    </div>
  );
}

function WorkshopMedia() {
  return (
    <div className="workshopMedia">
      <Image src="/images/laundromat.jpg" alt="Neighborhood service business owner" fill sizes="555px" />
      <div className="workshopBadge"><small>MAIN STREET FIELD NOTE · 07</small><b>RINSE &amp; RETURN</b><span>1,800 monthly customers<br />with one simple promise.</span></div>
    </div>
  );
}

function RightSidebar() {
  const news = [
    ["Small manufacturers test four-day production pilots", "24m ago · 4,806 readers"],
    ["Vacant storefronts become neighborhood micro-warehouses", "1h ago · 3,172 readers"],
    ["Portfolio interviews reshape entry-level hiring", "2h ago · 2,644 readers"],
    ["Community banks speed up small-business approvals", "3h ago · 1,908 readers"],
  ];
  return (
    <aside className="rightRail">
      <section className="card newsCard"><div className="railTitle"><h2>Network News</h2><CircleHelp size={16} fill="currentColor" /></div><h3>Top stories</h3>{news.map(([title, meta]) => <a href="#news" key={title}><b>{title}</b><span>{meta}</span></a>)}<button type="button">Show all news <ChevronRight size={14} /></button></section>
      <section className="card puzzleCard"><div className="railTitle"><h2>Today&apos;s puzzles</h2></div><a href="#puzzle"><i className="puzzleIcon zip">W</i><span><b>Wordway <small>#438</small></b><em>Connect the trail</em></span><ChevronRight size={16} /></a><a href="#puzzle"><i className="puzzleIcon tango">T</i><span><b>Tandem <small>#399</small></b><em>Balance every pair</em></span><ChevronRight size={16} /></a><a href="#puzzle"><i className="puzzleIcon queens">Q</i><span><b>Crowns <small>#553</small></b><em>Rule each region</em></span><ChevronRight size={16} /></a><a href="#puzzle"><i className="puzzleIcon mini">M</i><span><b>Mini Grid <small>#336</small></b><em>Find the hidden digits</em></span><ChevronRight size={16} /></a><button type="button">Show more <ChevronDown size={14} /></button></section>
      <section className="card promotedCard"><div className="promotedTop"><span>Promoted</span><MoreHorizontal size={17} /></div><div className="promotedLogo">SUNBEAM<br />PANTRY</div><h3>Sunbeam Pantry Grants</h3><p>Small ideas can change a block. Applications for neighborhood projects are now open.</p><small>Follow our local impact work</small><button type="button">Follow</button></section>
      <footer className="footerLinks"><a href="#about">About</a><a href="#accessibility">Accessibility</a><a href="#help">Help Center</a><a href="#privacy">Privacy &amp; Terms</a><a href="#ad">Ad Choices</a><a href="#advertising">Advertising</a><a href="#business">Business Services</a><a href="#app">Get the app</a><a href="#more">More</a><p><span className="miniBrand">Network</span><b>in</b> Fictional Harbor Network © 2026</p></footer>
    </aside>
  );
}

function PremiumBanner() {
  return (
    <section className="card premiumBanner"><div className="premiumPeople"><Avatar src="/images/person-2.jpg" size={44} /><Avatar src="/images/person-3.jpg" size={44} /><Avatar src="/images/person-1.jpg" size={44} /></div><div><b>Find your next team</b><span>Harvey, explore people and roles matched to your interests.</span></div><button type="button">Explore</button></section>
  );
}

function CreatePostModal({ onClose, onPublish }: { onClose: () => void; onPublish: (value: string) => void }) {
  const [value, setValue] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (value.trim()) onPublish(value.trim()); }
  return (
    <div className="modalBackdrop" role="presentation" onMouseDown={onClose}>
      <form className="postModal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <header><h2>Create a post</h2><button type="button" onClick={onClose} aria-label="Close"><X /></button></header>
        <div className="modalIdentity"><Avatar size={48} alt="Harvey" eager /><div><b>Harvey Yang</b><button type="button">Anyone <ChevronDown size={13} /></button></div></div>
        <textarea autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder="What do you want to talk about?" />
        <div className="modalTools"><button type="button" aria-label="Add photo"><ImageIcon /></button><button type="button" aria-label="Add video"><Clapperboard /></button><button type="button" aria-label="Celebrate"><Lightbulb /></button><button type="submit" disabled={!value.trim()}>Post</button></div>
      </form>
    </div>
  );
}

function MessagingDock() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <section className="messagePanel" aria-label="Messaging panel"><label><Search size={16} /><input placeholder="Search messages" /></label><div className="messageList"><a href="#chat"><Avatar src="/images/person-2.jpg" size={42} /><span><b>Leila Monroe</b><small>Sent the revised customer map · 12m</small></span></a><a href="#chat"><Avatar src="/images/person-3.jpg" size={42} /><span><b>Mateo Brooks</b><small>Tuesday afternoon works for me · 2h</small></span></a><a href="#chat"><Avatar src="/images/person-1.jpg" size={42} /><span><b>Olivia Hart</b><small>Thanks for the introduction! · 1d</small></span></a></div></section>}
      <button className="messagingDock" id="messaging" type="button" onClick={() => setOpen(!open)} aria-expanded={open}><Avatar size={30} /><b>Messaging</b><span><Ellipsis size={18} /><PenLine size={17} /><ChevronDown className={open ? "rotated" : ""} size={17} /></span></button>
    </>
  );
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [publishedPost, setPublishedPost] = useState("");
  return (
    <>
      <Header />
      <main className="pageShell" id="top">
        <LeftSidebar />
        <div className="feedColumn">
          <Composer onOpen={() => setModalOpen(true)} />
          <SortBar />
          {publishedPost && <Post author="Harvey Yang" avatar={AVATAR} subtitle="Computer science graduate student" time="now" text={publishedPost} likes={0} comments={0} followable={false} relationship="You" tags={["#learning", "#projects"]} />}
          <Post suggested author="Maya Chen" avatar="/images/person-3.jpg" subtitle="Product engineer at Waffle Atlas Studio" time="2h" text="I joined Waffle Atlas this week to help small teams turn ambitious prototypes into products people can actually use. The best part so far: every project begins with a customer story, not a feature list." likes={344} comments={24} reposts={7} tags={["#product", "#engineering", "#newrole"]}><WaffleAtlasMedia /></Post>
          <GeneratedAdFeed startAt={0} limit={1} />
          <Post author="Moss &amp; Meteor Club" avatar="/images/person-1.jpg" subtitle="Memberships for time well spent" time="Promoted" text="Trade another crowded weekend for something you'll remember. Moss &amp; Meteor members now get a $180 annual wellbeing credit." likes={293} comments={19} reposts={8} followable={false} relationship="Sponsored" tags={["#wellbeing", "#weekends"]}><MossMeteorMedia /><div className="adCaption"><div><b>$180 Wellbeing Credit</b><span>mossmeteor.example</span></div><button type="button">Learn more</button></div></Post>
          <GeneratedAdFeed startAt={1} limit={1} />
          <Post suggested author="Derek Alvarez" avatar="/images/person-2.jpg" subtitle="Founder at Pocket Harbor Advisory" time="4h" text="I mapped the hidden cost of founder-held knowledge across 31 growing service businesses. The biggest gap wasn't strategy; it was the everyday handoff between the person who knows and the team expected to deliver." likes={87} comments={13} reposts={6} tags={["#operations", "#leadership", "#growth"]}><HandoffMedia /></Post>
          <GeneratedAdFeed startAt={2} limit={1} />
          <Post author="Priya Nair" avatar="/images/person-3.jpg" subtitle="Research lead at Pebble Index Lab" time="6h" text="Customer reviews aren't just social proof. Group them by the job a buyer was trying to finish, and they become a remarkably honest product roadmap." likes={49} comments={8} followable={false} relationship="1st" tags={["#research", "#customers", "#strategy"]} />
          <GeneratedAdFeed startAt={3} limit={1} />
          <Post author="Crankleaf Works" avatar="/images/person-1.jpg" subtitle="Designing dependable workshop automation" time="Promoted" text="We're hiring an Automation Engineer to build practical machines for real production floors. Thoughtful systems thinking matters more than flashy demos." likes={586} comments={65} reposts={9} followable={false} relationship="Sponsored" tags={["#hiring", "#robotics", "#austin"]}><CrankleafMedia /></Post>
          <GeneratedAdFeed startAt={4} limit={1} />
          <GeneratedAdFeed startAt={5} />
          <PremiumBanner />
          <Post suggested author="Paper Kettle Journal" avatar="/images/person-2.jpg" subtitle="Olivia Hart follows this page" time="2d" text="We reviewed 620,000 product sessions to understand where buyers pause, compare, and leave. The most useful signal wasn't the exit page; it was the page immediately before it." likes={71} comments={12} reposts={4} tags={["#analytics", "#content", "#buyers"]}><div className="articlePreview"><div className="miniChart"><i /><i /><i /><i /></div><div><b>Where Buyers Pause: 620K Product Sessions Reviewed</b><span>paperkettle.example</span></div></div></Post>
          <Post suggested author="Elena Park" avatar="/images/person-1.jpg" subtitle="Building durable neighborhood businesses" time="5h" text="Rina turned a quiet wash-and-fold shop into a neighborhood habit by making one promise: every bag ready by 6. No app, no gimmick—just a clear standard her team can keep." likes={329} comments={140} reposts={7} tags={["#smallbusiness", "#operations", "#mainstreet"]}><WorkshopMedia /><div className="commentPreview"><Avatar src="/images/person-2.jpg" size={34} /><p><b>Jonah Bell</b> · Following<br /><span>Simple promises are often the strongest operating systems. This is a great field note.</span></p></div></Post>
        </div>
        <RightSidebar />
      </main>
      <MessagingDock />
      {modalOpen && <CreatePostModal onClose={() => setModalOpen(false)} onPublish={(value) => { setPublishedPost(value); setModalOpen(false); }} />}
    </>
  );
}
