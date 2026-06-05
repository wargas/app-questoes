import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { prisma } from "@/lib/prisma";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function DisciplinasPage() {

    const data = await prisma.discipline.findMany()

    return <div>
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Disciplinas</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-4">
            <ItemGroup>
                {data.map(item => (
                    <Item key={item.id} variant={"outline"} asChild>
                        <Link href={`/disciplinas/${item.id}`}>
                            <ItemContent>
                                <ItemTitle>{item.name}</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Button variant={`ghost`}>
                                    <ChevronRight />
                                </Button>
                            </ItemActions>
                        </Link>
                    </Item>
                ))}
            </ItemGroup>
        </div>
    </div>
}