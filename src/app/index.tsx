import { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AppIcon, type AppIconName } from "@/components/app-icon";
import { MaxContentWidth } from "@/constants/theme";
import {
  useAppStore,
  type MatchMode,
  type Tab,
  type TrainingMode,
} from "@/stores/app-store";

/* -------------------------------------------------------------------------- */
/*  Tokens                                                                    */
/*  Ink + citrus: deep indigo surfaces, one warm yellow for "do this" actions. */
/*  Mint = correct / done, coral = streak / loss, violet = rating.            */
/* -------------------------------------------------------------------------- */
const C = {
  ink: "#15132B",
  surface: "#211E3D",
  raised: "#2D2A52",
  line: "#3A366A",
  text: "#F4F2FF",
  muted: "#9C98C7",
  citrus: "#FFC23D",
  mint: "#5EE0A0",
  violet: "#9A8CFF",
  coral: "#FF7A66",
};

type IconName = AppIconName;

/* -------------------------------------------------------------------------- */
/*  Small shared pieces                                                       */
/* -------------------------------------------------------------------------- */
function ChunkyButton({
  label,
  onPress,
  tone = "citrus",
}: {
  label: string;
  onPress: () => void;
  tone?: "citrus" | "ghost";
}) {
  const citrus = tone === "citrus";
  return (
    <Pressable
      onPress={onPress}
      className={`items-center rounded-2xl border-b-4 py-4 active:translate-y-0.5 active:border-b-2 ${
        citrus
          ? "border-[#C98F00] bg-[#FFC23D]"
          : "border-[#3A366A] bg-[#2D2A52]"
      }`}
    >
      <Text
        className={`text-base font-extrabold ${citrus ? "text-[#15132B]" : "text-[#F4F2FF]"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Chip({
  icon,
  color,
  label,
}: {
  icon: IconName;
  color: string;
  label: string;
}) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-[#211E3D] px-3 py-1.5">
      <AppIcon name={icon} size={16} color={color} />
      <Text className="text-sm font-bold text-[#F4F2FF]">{label}</Text>
    </View>
  );
}

function ProgressBar({
  value,
  color = C.mint,
}: {
  value: number;
  color?: string;
}) {
  return (
    <View className="h-2.5 overflow-hidden rounded-full bg-[#15132B]">
      <View
        style={{ width: `${Math.round(value * 100)}%`, backgroundColor: color }}
        className="h-full rounded-full"
      />
    </View>
  );
}

function Header() {
  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full border-2 border-[#9A8CFF] bg-[#2D2A52]">
          <Text className="text-lg font-extrabold text-[#F4F2FF]">M</Text>
        </View>
        <View>
          <Text className="text-xs font-semibold text-[#9C98C7]">
            Welcome back
          </Text>
          <Text className="text-base font-extrabold text-[#F4F2FF]">Maya</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <Chip icon="flame" color={C.coral} label="12" />
        <Chip icon="trophy" color={C.violet} label="1,284" />
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Training tab                                                              */
/* -------------------------------------------------------------------------- */
function SprintHero() {
  return (
    <View className="mx-5 mt-3 overflow-hidden rounded-3xl bg-[#2D2A52] p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold text-[#9C98C7]">
          Today&apos;s sprint
        </Text>
        <View className="flex-row items-center gap-1.5 rounded-full bg-[#15132B] px-3 py-1">
          <AppIcon name="timer-outline" size={15} color={C.citrus} />
          <Text className="text-sm font-bold text-[#FFC23D]">60s</Text>
        </View>
      </View>

      {/* The memorable moment: the problem itself, oversized. */}
      <View className="my-7 items-center">
        <Text
          className="text-[64px] font-black leading-[72px] text-[#F4F2FF]"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          47 × 12
        </Text>
        <View className="mt-3 flex-row items-center gap-2">
          <Text className="text-3xl font-black text-[#9C98C7]">=</Text>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className="h-12 w-10 items-center justify-center rounded-xl border-b-4 border-[#3A366A] bg-[#15132B]"
            >
              <Text className="text-2xl font-black text-[#3A366A]">?</Text>
            </View>
          ))}
        </View>
        <Text className="mt-4 text-center text-sm text-[#9C98C7]">
          Hint: split it into 47 × 10 and 47 × 2.
        </Text>
      </View>

      <View className="mb-1.5 flex-row justify-between">
        <Text className="text-xs font-bold text-[#9C98C7]">Daily goal</Text>
        <Text className="text-xs font-bold text-[#5EE0A0]">40 / 60 XP</Text>
      </View>
      <ProgressBar value={40 / 60} />

      <View className="mt-5">
        <ChunkyButton label="Start sprint" onPress={() => {}} />
      </View>
    </View>
  );
}

const TRAINING_MODES: {
  id: TrainingMode;
  label: string;
  sub: string;
  icon: IconName;
}[] = [
  { id: "sprint", label: "Sprint", sub: "60 seconds", icon: "flash" },
  { id: "marathon", label: "Marathon", sub: "50 problems", icon: "infinite" },
  { id: "zen", label: "Zen", sub: "No timer", icon: "leaf" },
];

function ModePicker() {
  const mode = useAppStore((s) => s.trainingMode);
  const setMode = useAppStore((s) => s.setTrainingMode);

  return (
    <View className="mt-6 flex-row gap-3 px-5">
      {TRAINING_MODES.map((m) => {
        const active = m.id === mode;
        return (
          <Pressable
            key={m.id}
            onPress={() => setMode(m.id)}
            className={`flex-1 items-center rounded-2xl border-2 px-2 py-3.5 ${
              active
                ? "border-[#FFC23D] bg-[#2D2A52]"
                : "border-[#2D2A52] bg-[#211E3D]"
            }`}
          >
            <AppIcon
              name={m.icon}
              size={22}
              color={active ? C.citrus : C.muted}
            />
            <Text className="mt-1.5 text-sm font-extrabold text-[#F4F2FF]">
              {m.label}
            </Text>
            <Text className="text-xs text-[#9C98C7]">{m.sub}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type NodeState = "done" | "current" | "locked";
const PATH: {
  title: string;
  sub: string;
  state: NodeState;
  stars?: number;
  icon: IconName;
}[] = [
  {
    title: "Add & subtract fast",
    sub: "Round, then adjust",
    state: "done",
    stars: 3,
    icon: "add",
  },
  {
    title: "Multiply by 11",
    sub: "The neighbor trick",
    state: "done",
    stars: 2,
    icon: "close",
  },
  {
    title: "Squares ending in 5",
    sub: "2 of 5 lessons",
    state: "current",
    icon: "star",
  },
  {
    title: "Percent shortcuts",
    sub: "10%, then scale",
    state: "locked",
    icon: "lock-closed",
  },
  {
    title: "Fractions to decimals",
    sub: "Learn the eighths",
    state: "locked",
    icon: "lock-closed",
  },
];
const OFFSETS = [0, 44, 0, -44, 0];

function SkillPath() {
  return (
    <View className="mt-8">
      <View className="mb-4 px-5">
        <Text className="text-xl font-black text-[#F4F2FF]">Your path</Text>
        <Text className="text-sm text-[#9C98C7]">
          Mental math tricks, one at a time
        </Text>
      </View>

      {PATH.map((node, i) => {
        const done = node.state === "done";
        const current = node.state === "current";
        return (
          <View key={node.title} className="items-center pb-6">
            <Pressable
              style={{ transform: [{ translateX: OFFSETS[i] }] }}
              className="items-center active:opacity-80"
            >
              <View
                className={`h-20 w-20 items-center justify-center rounded-full border-b-[6px] ${
                  done
                    ? "border-[#2FA874] bg-[#5EE0A0]"
                    : current
                      ? "border-[#C98F00] bg-[#FFC23D]"
                      : "border-[#211E3D] bg-[#2D2A52]"
                }`}
              >
                <AppIcon
                  name={done ? "checkmark" : node.icon}
                  size={34}
                  color={done || current ? C.ink : C.muted}
                />
              </View>

              {done && (
                <View className="-mt-2 flex-row rounded-full bg-[#15132B] px-2 py-0.5">
                  {[0, 1, 2].map((s) => (
                    <AppIcon
                      key={s}
                      name="star"
                      size={12}
                      color={s < (node.stars ?? 0) ? C.citrus : C.line}
                    />
                  ))}
                </View>
              )}

              <Text
                className={`mt-2 text-center text-[15px] font-extrabold ${
                  node.state === "locked" ? "text-[#9C98C7]" : "text-[#F4F2FF]"
                }`}
              >
                {node.title}
              </Text>
              <Text className="text-center text-xs text-[#9C98C7]">
                {node.sub}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function TrainingScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <SprintHero />
      <ModePicker />
      <SkillPath />
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/*  Find match tab                                                            */
/* -------------------------------------------------------------------------- */
const MATCH_MODES: {
  id: MatchMode;
  label: string;
  sub: string;
  icon: IconName;
}[] = [
  { id: "bullet", label: "Bullet", sub: "1 min", icon: "flash" },
  { id: "blitz", label: "Blitz", sub: "3 min", icon: "speedometer" },
  { id: "rapid", label: "Rapid", sub: "5 min", icon: "hourglass" },
];

const RECENT = [
  { name: "Rhea_K", rating: 1301, score: "14 – 12", win: true },
  { name: "quickfingers", rating: 1266, score: "9 – 11", win: false },
  { name: "NumberNinja", rating: 1240, score: "15 – 7", win: true },
];

function RatingCard() {
  return (
    <View className="mx-5 mt-3 flex-row items-center justify-between rounded-3xl bg-[#2D2A52] p-5">
      <View>
        <Text className="text-sm font-bold text-[#9C98C7]">Your rating</Text>
        <Text className="text-5xl font-black text-[#F4F2FF]">1,284</Text>
        <View className="mt-1 flex-row items-center gap-1">
          <AppIcon name="trending-up" size={16} color={C.mint} />
          <Text className="text-sm font-bold text-[#5EE0A0]">
            +18 this week
          </Text>
        </View>
      </View>
      <View className="items-center rounded-2xl bg-[#15132B] px-4 py-3">
        <AppIcon name="shield-half" size={30} color={C.violet} />
        <Text className="mt-1 text-sm font-extrabold text-[#F4F2FF]">
          Gold II
        </Text>
      </View>
    </View>
  );
}

function MatchModePicker() {
  const mode = useAppStore((s) => s.matchMode);
  const setMode = useAppStore((s) => s.setMatchMode);
  const search = useAppStore((s) => s.search);
  const locked = search !== "idle";

  return (
    <View className="mt-5 flex-row gap-3 px-5">
      {MATCH_MODES.map((m) => {
        const active = m.id === mode;
        return (
          <Pressable
            key={m.id}
            disabled={locked}
            onPress={() => setMode(m.id)}
            className={`flex-1 items-center rounded-2xl border-2 py-3.5 ${
              active
                ? "border-[#FFC23D] bg-[#2D2A52]"
                : "border-[#2D2A52] bg-[#211E3D]"
            } ${locked && !active ? "opacity-40" : ""}`}
          >
            <AppIcon
              name={m.icon}
              size={22}
              color={active ? C.citrus : C.muted}
            />
            <Text className="mt-1.5 text-sm font-extrabold text-[#F4F2FF]">
              {m.label}
            </Text>
            <Text className="text-xs text-[#9C98C7]">{m.sub}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PlayerBadge({
  name,
  rating,
  color,
}: {
  name: string;
  rating: string;
  color: string;
}) {
  return (
    <View className="flex-1 items-center">
      <View
        style={{ borderColor: color }}
        className="h-16 w-16 items-center justify-center rounded-full border-2 bg-[#2D2A52]"
      >
        <Text className="text-2xl font-black text-[#F4F2FF]">{name[0]}</Text>
      </View>
      <Text className="mt-2 text-sm font-extrabold text-[#F4F2FF]">{name}</Text>
      <Text className="text-xs text-[#9C98C7]">{rating}</Text>
    </View>
  );
}

function Pulse({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

function MatchStage() {
  const search = useAppStore((s) => s.search);
  const mode = useAppStore((s) => s.matchMode);
  const startSearch = useAppStore((s) => s.startSearch);
  const cancelSearch = useAppStore((s) => s.cancelSearch);
  const resetSearch = useAppStore((s) => s.resetSearch);
  const modeLabel = MATCH_MODES.find((m) => m.id === mode)?.label ?? "";

  return (
    <View className="mx-5 mt-5 rounded-3xl bg-[#211E3D] p-5">
      <View className="flex-row items-center justify-center gap-2">
        <View className="h-2 w-2 rounded-full bg-[#5EE0A0]" />
        <Text className="text-sm font-bold text-[#9C98C7]">
          2,431 players online
        </Text>
      </View>

      <View className="my-6 flex-row items-center">
        <PlayerBadge name="You" rating="1,284" color={C.violet} />
        <Text className="text-2xl font-black text-[#3A366A]">VS</Text>
        {search === "found" ? (
          <PlayerBadge name="Rhea_K" rating="1,301" color={C.coral} />
        ) : (
          <View className="flex-1 items-center">
            <Pulse>
              <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#3A366A]">
                <AppIcon
                  name={search === "searching" ? "search" : "help"}
                  size={26}
                  color={C.muted}
                />
              </View>
            </Pulse>
            <Text className="mt-2 text-sm font-extrabold text-[#9C98C7]">
              {search === "searching" ? "Searching…" : "Opponent"}
            </Text>
            <Text className="text-xs text-[#9C98C7]">±100 rating</Text>
          </View>
        )}
      </View>

      {search === "idle" && (
        <ChunkyButton label={`Find ${modeLabel} match`} onPress={startSearch} />
      )}
      {search === "searching" && (
        <ChunkyButton label="Cancel" tone="ghost" onPress={cancelSearch} />
      )}
      {search === "found" && (
        <View className="gap-3">
          <ChunkyButton label="Play now" onPress={resetSearch} />
          <Pressable onPress={resetSearch} className="items-center py-1">
            <Text className="text-sm font-bold text-[#9C98C7]">Decline</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function RecentMatches() {
  return (
    <View className="mt-8 px-5">
      <Text className="mb-3 text-xl font-black text-[#F4F2FF]">
        Recent matches
      </Text>
      <View className="gap-2.5">
        {RECENT.map((r) => (
          <View
            key={r.name}
            className="flex-row items-center rounded-2xl bg-[#211E3D] px-4 py-3.5"
          >
            <View
              className={`mr-3 h-9 w-9 items-center justify-center rounded-full ${
                r.win ? "bg-[#5EE0A0]" : "bg-[#FF7A66]"
              }`}
            >
              <Text className="text-sm font-black text-[#15132B]">
                {r.win ? "W" : "L"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-extrabold text-[#F4F2FF]">
                {r.name}
              </Text>
              <Text className="text-xs text-[#9C98C7]">
                {r.rating.toLocaleString()} rating
              </Text>
            </View>
            <Text className="text-base font-extrabold text-[#F4F2FF]">
              {r.score}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MatchScreen() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <RatingCard />
      <MatchModePicker />
      <MatchStage />
      <RecentMatches />
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bottom navigation                                                         */
/* -------------------------------------------------------------------------- */
const TABS: {
  id: Tab;
  label: string;
  icon: IconName;
  iconOutline: IconName;
}[] = [
  {
    id: "training",
    label: "Training",
    icon: "barbell",
    iconOutline: "barbell-outline",
  },
  {
    id: "match",
    label: "Find match",
    icon: "people",
    iconOutline: "people-outline",
  },
];

function BottomNav() {
  const tab = useAppStore((s) => s.tab);
  const setTab = useAppStore((s) => s.setTab);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      className="flex-row border-t-2 border-[#2D2A52] bg-[#15132B] px-4 pt-2.5"
    >
      {TABS.map((t) => {
        const active = t.id === tab;
        return (
          <Pressable
            key={t.id}
            onPress={() => setTab(t.id)}
            className="flex-1 items-center"
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <View
              className={`w-full items-center rounded-2xl py-2 ${
                active ? "bg-[#2D2A52]" : "bg-transparent"
              }`}
            >
              <AppIcon
                name={active ? t.icon : t.iconOutline}
                size={26}
                color={active ? C.citrus : C.muted}
              />
              <Text
                className={`mt-0.5 text-xs font-extrabold ${
                  active ? "text-[#FFC23D]" : "text-[#9C98C7]"
                }`}
              >
                {t.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  Screen                                                                    */
/* -------------------------------------------------------------------------- */
export default function HomeScreen() {
  const tab = useAppStore((s) => s.tab);

  return (
    <View className="flex-1 flex-row justify-center bg-[#15132B]">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, maxWidth: MaxContentWidth }}
      >
        <Header />
        <View className="flex-1">
          {tab === "training" ? <TrainingScreen /> : <MatchScreen />}
        </View>
        <BottomNav />
      </SafeAreaView>
    </View>
  );
}
