<script lang="ts">
    import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
    import ShoppingBag from "@tabler/icons-svelte/icons/shopping-bag";
    import SearchIcon from "@tabler/icons-svelte/icons/search";
    import SettingsIcon from "@tabler/icons-svelte/icons/settings";
    import PredictionIcon from "@tabler/icons-svelte/icons/artboard";
    import RevnueIcon from "@tabler/icons-svelte/icons/database-dollar";
    import DashboardIcon from "@tabler/icons-svelte/icons/layout-dashboard";
    import NavMain from "./nav-main.svelte";
    import NavSecondary from "./nav-secondary.svelte";
    import NavUser from "./nav-user.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import type { ComponentProps } from "svelte";
    import { useSidebar } from "$lib/components/ui/sidebar/index.js";
    import { page } from "$app/state";
    import { resolve } from "$app/paths";
    import type { User } from "$lib/helpers/auth-client";
    import type { Icon } from "@tabler/icons-svelte";

    type Nav = {
        title: string;
        url: Parameters<typeof resolve>[0];
        icon?: Icon;
    };

    type NavigationData = {
        user: User;
        navMain: Nav[];
        navSecondary: Nav[];
    };

    const data: NavigationData = {
        user: page.data.user,
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: DashboardIcon,
            },
            {
                title: "Daily Forecast",
                url: "#",
                icon: PredictionIcon,
            },
            {
                title: "Production Ledger",
                url: "#",
                icon: ChartBarIcon,
            },
            {
                title: "Sales Performance",
                url: "#",
                icon: RevnueIcon,
            },
        ],
        navSecondary: [
            {
                title: "Settings",
                url: "/settings",
                icon: SettingsIcon,
            },
            {
                title: "Search",
                url: "#",
                icon: SearchIcon,
            },
        ],
    };

    let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
    const sidebar = useSidebar();
</script>

<Sidebar.Root collapsible="icon" {...restProps}>
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton
                    size="lg"
                    class="data-[slot=sidebar-menu-button]:p-1.5!"
                >
                    {#snippet child({ props })}
                        <a href={resolve("/dashboard")} {...props}>
                            <ShoppingBag
                                class={sidebar.open ? "size-10!" : "size-5!"}
                            />
                            <span class="flex flex-col items-start">
                                <span class="text-base font-semibold"
                                    >LMRS Shop</span
                                >
                                <span class="text-base"
                                    >Intelligence System</span
                                >
                            </span>
                        </a>
                    {/snippet}
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} class="mt-auto" />
    </Sidebar.Content>
    <Sidebar.Footer>
        <NavUser user={data.user} />
    </Sidebar.Footer>
</Sidebar.Root>
