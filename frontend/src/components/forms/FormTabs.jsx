import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '../../lib/utils';

const FormTabs = ({
  tabs = [],
  defaultValue,
  className = "",
  tabsListClassName = "",
  ...props
}) => {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.value} className={cn("w-full", className)} {...props}>
      <TabsList className={cn("grid w-full grid-cols-3 h-auto p-1 bg-muted/50 rounded-lg", tabsListClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium rounded-md transition-all duration-200"
          >
            {tab.icon && (
              <div className="p-1 bg-primary/10 rounded">
                {tab.icon}
              </div>
            )}
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FormTabs;
