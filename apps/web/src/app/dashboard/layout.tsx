'use client';

import {ApiErrorAlertPanel} from '@smarty-app/components';
import {SmartyText} from '@smarty-app/controls-basic';
import {en} from '@smarty-app/language';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import styles from './DashboardLayout.module.css';

const menuItems = [
  {
    href: '/dashboard/account/',
    label: en.accountTab,
  },
];

/**
 * Pages reached from a menu that have their own back button. The dashboard
 * navigation is hidden on them, so the only way out is back.
 */
const pagesWithBackButton = [
  '/dashboard/account/change-email/',
  '/dashboard/account/payment-history/',
];

function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * @param props - Component props.
 * @param props.children - Content to be rendered within the layout.
 *
 * @returns A React element.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeIndex = menuItems.findIndex(
    (item) => withTrailingSlash(item.href) === withTrailingSlash(pathname),
  );
  const showNavigation = !pagesWithBackButton.includes(
    withTrailingSlash(pathname),
  );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            {showNavigation && (
              <nav className={styles.sidebarNav}>
                <ul className={`${styles.sidebarList} smarty-gap-l`}>
                  {menuItems.map((item, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          data-testid={`sidebar-${item.label.toLowerCase()}-link`}
                          role="button"
                          aria-label={item.label}
                          className={`${styles.sidebarLink} ${
                            isActive ? styles.sidebarLinkActive : ''
                          }`}>
                          <span
                            className={styles.navGroup}
                            role="none"
                            aria-hidden="true">
                            <SmartyText
                              className={`${styles.navText} smarty-caption-l font-theme-bold`}>
                              {item.label}
                            </SmartyText>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </aside>

          <main className={styles.main}>
            <ApiErrorAlertPanel className={'w-full smarty-mb-l'} />
            {children}
          </main>
        </div>
      </div>

      {showNavigation && (
        <nav className={styles.bottomNav}>
          <ul
            className={`${styles.tabList} ${
              activeIndex === -1 ? styles.tabListNoActive : ''
            }`}
            style={
              {
                '--active-index': activeIndex,
                '--tab-count': menuItems.length,
              } as React.CSSProperties
            }>
            {menuItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={item.href} className={styles.tabItem}>
                  <Link
                    href={item.href}
                    role="button"
                    aria-label={item.label}
                    className={`${styles.tabLink} ${
                      isActive ? styles.tabLinkActive : ''
                    }`}>
                    <span
                      className={styles.navGroup}
                      role="none"
                      aria-hidden="true">
                      <SmartyText className={styles.navText}>
                        {item.label}
                      </SmartyText>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
