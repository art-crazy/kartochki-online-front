"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { gradientPresets, marketplaceOptions, mobileRules } from "@/shared/config/ui-kit";
import {
  Accordion,
  Avatar,
  Badge,
  BlogCard,
  Breadcrumbs,
  Button,
  CardPreviewGrid,
  Chip,
  GenerateCtaBanner,
  HeroBadge,
  Input,
  LoadingSteps,
  MarketplaceBadgeRow,
  MobileBottomNav,
  ModalCard,
  NavItem,
  PlanCard,
  PlatformSelector,
  ProgressBar,
  ProjectCard,
  ResultCard,
  Select,
  SidebarPlanCard,
  SidebarProfileCard,
  SkeletonCard,
  Spinner,
  StatCard,
  Switch,
  Textarea,
  Toast,
  UploadZone,
} from "@/shared/ui";
import { classNames } from "@/shared/lib/classNames";
import {
  avatarShowcase,
  breadcrumbItems,
  blogCards,
  mobileNavItems,
  navigationItems,
  darkTokens,
  faqItems,
  lightTokens,
  loadingSteps,
  planCards,
  projectPreviewSets,
  sectionLinks,
  statCards,
  typographyScale,
} from "../model/content";
import styles from "./UIKitPage.module.scss";

export function UIKitPage() {
  const [platform, setPlatform] = useState<string>(marketplaceOptions[0].value);
  const [switches, setSwitches] = useState({
    notifications: true,
    yearly: true,
    emails: false,
  });
  const [activeFilter, setActiveFilter] = useState("Все");
  const [activeTheme, setActiveTheme] = useState("Минимализм");

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          {sectionLinks.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={styles.navLink}>
              {label}
            </a>
          ))}
        </nav>

        <header className={styles.hero}>
          <HeroBadge text="UI-слой для старта разработки kartochki.online" />
          <h1 className={styles.title}>Компоненты, токены и адаптивные паттерны из макета</h1>
          <p className={styles.description}>
            Эта страница переносит `docs/mockups/components.html` в переиспользуемый код на `shared/ui` с живыми
            состояниями, мобильными правилами и составными карточками для маркетинга и приложения.
          </p>
        </header>

        <Section id="tokens" title="1. Дизайн-токены" sub="CSS variables и продуктовые цвета для маркетинга и дашборда">
          <Canvas title="Основные цвета">
            <div className={styles.tokenGrid}>
              {lightTokens.map(([name, value]) => (
                <Token key={name} name={name} value={value} />
              ))}
            </div>
          </Canvas>
          <Canvas dark title="Тёмная тема">
            <div className={styles.tokenGrid}>
              {darkTokens.map(([name, value]) => (
                <Token key={name} name={name} value={value} dark />
              ))}
            </div>
          </Canvas>
          <Canvas title="Маркетплейсы">
            <div className={styles.tokenGrid}>
              <Token name="wb" value="var(--marketplace-wb)" />
              <Token name="wb-dim" value="var(--marketplace-wb-dim)" />
              <Token name="ozon" value="var(--marketplace-ozon)" />
              <Token name="ozon-dim" value="var(--marketplace-ozon-dim)" />
              <Token name="ym" value="var(--marketplace-ym)" />
              <Token name="ym-dim" value="var(--marketplace-ym-dim)" />
            </div>
          </Canvas>
        </Section>

        <Section id="typography" title="2. Типографика" sub="Geologica для display, Golos Text для интерфейса и контента">
          <Canvas>
            <div className={styles.typeScale}>
              {typographyScale.map((item) => (
                <div key={item.meta} className={styles.typeRow}>
                  <div className={styles.typeMeta}>{item.meta}</div>
                  <div>{item.sample}</div>
                </div>
              ))}
            </div>
          </Canvas>
        </Section>

        <Section id="buttons" title="3. Кнопки" sub="Варианты, размеры, состояния, иконки и тёмная тема">
          <Canvas title="Светлая тема">
            <div className={styles.row}>
              <Button>Начать бесплатно →</Button>
              <Button variant="secondary">Войти</Button>
              <Button variant="outline">Как работает</Button>
              <Button variant="ghost">Отмена</Button>
              <Button variant="danger">Удалить аккаунт</Button>
            </div>
            <div className={styles.label}>Размеры</div>
            <div className={styles.row}>
              <Button size="sm">Маленькая</Button>
              <Button size="md">Средняя</Button>
              <Button size="lg">Большая</Button>
              <Button size="xl">XL / hero</Button>
            </div>
            <div className={styles.label}>Состояния</div>
            <div className={styles.row}>
              <Button loading>⏳ Загрузка...</Button>
              <Button disabled>Недоступно</Button>
              <Button variant="outline" iconOnly aria-label="Уведомления">
                🔔
              </Button>
              <Button variant="outline" iconOnly aria-label="Скачать">
                ↓
              </Button>
              <Button variant="ghost" iconOnly aria-label="Закрыть">
                ✕
              </Button>
            </div>
            <div className={styles.label}>Блочная на мобилке</div>
            <Button size="lg" block>
              ⚡ Сгенерировать карточки
            </Button>
          </Canvas>
          <Canvas dark title="Тёмная тема">
            <div className={styles.row}>
              <Button variant="darkPrimary">+ Создать карточки</Button>
              <Button variant="darkOutline">↺ Сбросить</Button>
              <Button variant="darkOutline">🔔</Button>
            </div>
          </Canvas>
        </Section>

        <Section id="inputs" title="4. Поля ввода" sub="Input, Select, Textarea, состояния ошибки и успеха, тёмный вариант">
          <Canvas>
            <div className={styles.inputStack}>
              <Input label="Email" placeholder="you@example.com" hint="Используется для входа и уведомлений" />
              <Input label="Пароль" type="password" placeholder="Минимум 8 символов" icon="🔒" />
              <Input label="Название проекта" placeholder="Кроссовки Nike" error="Это поле обязательно" />
              <Input label="Поиск" type="search" placeholder="Инфографика..." icon="🔍" success />
              <Select label="Площадка" defaultValue="wildberries">
                {marketplaceOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <Input label="Телефон" type="tel" placeholder="+7 (___) ___-__-__" disabled />
            </div>
          </Canvas>
          <Canvas dark title="Тёмная тема">
            <div className={styles.inputStack}>
              <Input dark label="Название проекта" placeholder="Кроссовки Nike" />
              <Input dark label="Подтверждение" placeholder="Введите УДАЛИТЬ" />
              <Textarea dark label="Описание шаблона" placeholder="Сдержанный стиль, акцент на выгоду и состав." />
            </div>
          </Canvas>
        </Section>

        <Section id="badges" title="5. Бейджи, чипы, теги" sub="Badge для статуса и Chip для фильтров и тем">
          <Canvas title="Badge">
            <div className={styles.row}>
              <Badge tone="accent">Новое</Badge>
              <Badge tone="success">✓ Сохранено</Badge>
              <Badge tone="danger">Ошибка</Badge>
              <Badge tone="neutral">Черновик</Badge>
              <Badge tone="wb">Wildberries</Badge>
              <Badge tone="ozon">Ozon</Badge>
              <Badge tone="ym">Яндекс Маркет</Badge>
            </div>
            <div className={styles.label}>Chip</div>
            <div className={styles.row}>
              {["Все", "Wildberries", "Ozon", "Яндекс Маркет"].map((item) => (
                <Chip key={item} selected={activeFilter === item} onClick={() => setActiveFilter(item)}>
                  {item}
                </Chip>
              ))}
              {["Главная", "Инфографика", "Состав"].map((item) => (
                <Chip
                  key={item}
                  selected={activeFilter === item}
                  accentSelected
                  onClick={() => setActiveFilter(item)}
                >
                  {item}
                </Chip>
              ))}
            </div>
          </Canvas>
          <Canvas dark title="Тёмная тема">
            <div className={styles.row}>
              <Badge tone="dark">Популярный</Badge>
              {["Минимализм", "Яркий", "Тёмный", "Белый фон"].map((item) => (
                <Chip key={item} dark selected={activeTheme === item} onClick={() => setActiveTheme(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </Canvas>
        </Section>

        <Section id="cards" title="6. Карточки" sub="StatCard, ProjectCard, PlanCard, ResultCard и BlogCard">
          <Canvas dark title="StatCard Г— 3">
            <div className={styles.statGrid}>
                {statCards.map((card) => (
                  <StatCard
                    key={card.label}
                    label={card.label}
                    value={
                      card.valueSuffix ? (
                        <>
                          {card.value} <span className={styles.statValueSuffix}>{card.valueSuffix}</span>
                        </>
                      ) : (
                        card.value
                      )
                    }
                    description={
                      card.descriptionAccent ? (
                        <>
                          {card.description} <span className={styles.statAccent}>{card.descriptionAccent}</span>
                        </>
                      ) : (
                        card.description
                      )
                    }
                    progress={card.progress}
                  />
                ))}
              </div>
            </Canvas>
          <Canvas dark title="ProjectCard">
            <div className={styles.projectGrid}>
              <ProjectCard title="Кроссовки Nike" meta="6 карточек" badge={<Badge tone="wb">WB</Badge>} previews={[...projectPreviewSets[0]]} />
              <ProjectCard title="Крем увлажняющий" meta="8 карточек" badge={<Badge tone="ozon">Ozon</Badge>} previews={[...projectPreviewSets[1]]} />
              <ProjectCard addCard />
            </div>
          </Canvas>
          <Canvas title="PlanCard">
            <div className={styles.planGrid}>
              {planCards.map((card) => (
                <PlanCard
                  key={card.name}
                  {...card}
                  action={
                    <Button variant={card.popular ? "primary" : "outline"} block>
                      {card.actionLabel}
                    </Button>
                  }
                />
              ))}
            </div>
          </Canvas>
          <Canvas dark title="ResultCard">
            <div className={styles.resultGrid}>
              {["Главная", "Инфографика", "Состав"].map((item, index) => (
                <ResultCard key={item} title={item} gradient={gradientPresets[index]} />
              ))}
            </div>
          </Canvas>
          <Canvas title="BlogCard">
            <div className={styles.blogGrid}>
              {blogCards.map((card) => (
                <BlogCard
                  key={card.title}
                  title={card.title}
                  meta={card.meta}
                  gradient={card.gradient}
                  tag={<Badge tone={card.tone === "accent" ? "accent" : card.tone}>{card.tone === "wb" ? "Wildberries" : card.tone === "ozon" ? "Ozon" : "WB + Ozon + ЯМ"}</Badge>}
                />
              ))}
            </div>
          </Canvas>
        </Section>

        <Section id="controls" title="7. Контролы" sub="Switch, ProgressBar, UploadZone и PlatformSelector">
          <Canvas dark title="Switch">
            <div className={styles.gridAuto}>
              <Switch
                checked={switches.notifications}
                label="Уведомления о готовности"
                description="Письмо когда карточки готовы"
                onToggle={() => setSwitches((state) => ({ ...state, notifications: !state.notifications }))}
              />
              <Switch
                checked={switches.yearly}
                accent
                label="Годовая подписка"
                description="Скидка 20%"
                onToggle={() => setSwitches((state) => ({ ...state, yearly: !state.yearly }))}
              />
              <Switch
                checked={switches.emails}
                label="Маркетинговые письма"
                description="Акции и спецпредложения"
                onToggle={() => setSwitches((state) => ({ ...state, emails: !state.emails }))}
              />
            </div>
            <div className={classNames(styles.label, styles.darkLabel)}>ProgressBar</div>
            <div className={styles.gridAuto}>
              <ProgressBar dark label="Карточек использовано" value={7} max={10} />
              <ProgressBar dark label="Загрузка фото" value={100} max={100} tone="success" valueLabel="100%" />
              <ProgressBar dark label="Лимит исчерпан" value={10} max={10} tone="danger" valueLabel="10 / 10" />
            </div>
          </Canvas>
          <Canvas dark title="UploadZone">
            <div className={styles.grid3}>
              <UploadZone title="Перетащи или нажми" description="JPG, PNG до 10 МБ" />
              <UploadZone title="Отпусти файл" description="drag-over" state="dragOver" />
              <UploadZone title="photo.jpg" description="Нажми чтобы заменить" state="file" />
            </div>
            <div className={classNames(styles.label, styles.darkLabel)}>PlatformSelector</div>
            <PlatformSelector options={marketplaceOptions} value={platform} onChange={setPlatform} />
          </Canvas>
        </Section>

        <Section id="navigation" title="8. Навигация" sub="NavItem, SidebarPlanCard, Avatar, Breadcrumbs и MobileBottomNav">
          <Canvas dark>
            <div className={styles.sidebarGrid}>
              <div className={styles.sidebarColumn}>
                <div className={classNames(styles.label, styles.darkLabel)}>NavItem</div>
                <div className={styles.navList}>
                  {navigationItems.map((item) => (
                    <NavItem key={item.label} icon={item.icon} label={item.label} active={item.active} badge={item.badge} />
                  ))}
                </div>
              </div>
              <div className={styles.sidebarColumn}>
                <div className={classNames(styles.label, styles.darkLabel)}>SidebarPlanCard + Avatar</div>
                <div className={styles.sidebarStack}>
                <SidebarPlanCard />
                  <SidebarProfileCard initials="ИИ" name="Иван Иванов" plan="Бесплатный план" />
                </div>
              </div>
            </div>
          </Canvas>
          <Canvas title="Avatar и Breadcrumbs">
            <div className={styles.row}>
              {avatarShowcase.map((item) => (
                <Avatar key={`${item.initials}-${item.size}`} initials={item.initials} size={item.size} gradient={item.gradient} />
              ))}
            </div>
            <div className={styles.label}>Breadcrumbs</div>
            <Breadcrumbs items={[...breadcrumbItems]} />
          </Canvas>
        </Section>

        <Section id="feedback" title="9. Фидбек" sub="Toast, Modal, Spinner, Skeleton, LoadingSteps и Accordion">
          <Canvas dark>
            <div className={styles.feedbackStack}>
              <div>
                <div className={classNames(styles.label, styles.darkLabel)}>Toast — 3 варианта</div>
                <div className={styles.feedbackToastStack}>
                  <Toast tone="success" text="Карточки готовы к скачиванию" />
                  <Toast tone="danger" text="Ошибка генерации — попробуй ещё раз" />
                  <Toast tone="accent" text="Переходим к оплате через ЮKassa..." />
                </div>
              </div>
              <div>
                <div className={classNames(styles.label, styles.darkLabel)}>LoadingSteps (генерация)</div>
                <LoadingSteps items={[...loadingSteps]} />
              </div>
              <div>
                <div className={classNames(styles.label, styles.darkLabel)}>Spinner</div>
                <div className={styles.spinnerRow}>
                  <Spinner />
                  <Spinner accent medium />
                  <Spinner large />
                </div>
              </div>
              <div>
                <div className={classNames(styles.label, styles.darkLabel)}>Skeleton</div>
                <div className={styles.feedbackSkeletonGrid}>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            </div>
          </Canvas>
          <Canvas dark title="Modal">
            <ModalCard />
          </Canvas>
          <Canvas title="Accordion (FAQ)">
            <Accordion items={[...faqItems]} />
          </Canvas>
        </Section>

        <Section id="domain" title="10. Доменные компоненты" sub="HeroBadge, MarketplaceBadgeRow, CardPreviewGrid и GenerateCTABanner">
          <Canvas>
            <div className={styles.domainLightStack}>
              <div className={styles.label}>HeroBadge</div>
              <HeroBadge text="ИИ-генератор карточек для маркетплейсов" />
              <div className={styles.label}>MarketplaceBadge — строка с площадками</div>
              <MarketplaceBadgeRow />
            </div>
          </Canvas>
          <Canvas dark>
            <div className={styles.domainDarkStack}>
              <div className={styles.domainPreviewWrap}>
                <div className={classNames(styles.label, styles.darkLabel)}>CardPreviewGrid (6 превью)</div>
                <CardPreviewGrid previews={[...gradientPresets]} />
              </div>
              <div className={classNames(styles.label, styles.darkLabel)}>GenerateCTABanner</div>
              <GenerateCtaBanner />
            </div>
          </Canvas>
        </Section>

        <Section id="mobile" title="11. Мобильные паттерны" sub="MobileBottomNav · Sidebar Drawer · Hamburger Nav · touch targets · живые превью">
          <Canvas dark title="MobileBottomNav — компонент">
            <div className={styles.mobileNavPreview}>
              <MobileBottomNav
                activeLabel="Создать"
                items={[...mobileNavItems]}
              />
            </div>
            <div className={classNames(styles.label, styles.darkLabel)}>Адаптивные правила</div>
            <div className={classNames(styles.rulesGrid, styles.mobileRulesGrid)}>
              {mobileRules.map((rule) => (
                <div key={rule.title} className={styles.ruleCard}>
                  <div className={styles.ruleTitle}>
                    {rule.icon} {rule.title} — {rule.label}
                  </div>
                  {rule.items.map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </Canvas>
        </Section>
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  sub,
  children,
}: {
  id: string;
  title: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>{title}</div>
        <div className={styles.sectionSub}>{sub}</div>
      </div>
      {children}
    </section>
  );
}

function Canvas({
  dark = false,
  title,
  children,
}: {
  dark?: boolean;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={dark ? styles.canvasDark : styles.canvasLight}>
      {title ? <div className={classNames(styles.label, dark && styles.darkLabel)}>{title}</div> : null}
      {children}
    </div>
  );
}

function Token({ name, value, dark = false }: { name: string; value: string; dark?: boolean }) {
  return (
    <div className={styles.tokenCard}>
      <div className={styles.tokenColor} style={{ background: value }} />
      <div className={classNames(styles.tokenName, dark && styles.tokenNameDark)}>
        {name}
      </div>
    </div>
  );
}
