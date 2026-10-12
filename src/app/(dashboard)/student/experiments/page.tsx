'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ExperimentBottomSheetDrawer from '@/components/experiment/ExperimentBottomSheetDrawer';
import { ALL_EXPERIMENTS } from '@/lib/experimentsData';

export default function StudentExperiments() {
  const [experiments, setExperiments] = useState<any[]>(ALL_EXPERIMENTS);
  const [selectedExp, setSelectedExp] = useState<any | null>(null);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const { data } = await (supabase as any)
          .from('experiments')
          .select('*')
          .eq('is_active', true)
          .order('title');
        if (data && data.length > 0) setExperiments(data);
      } catch {
        // Fallback to ALL_EXPERIMENTS
      }
    };
    fetchExperiments();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Experiments Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiments.map((exp) => (
          <Card
            key={exp.id}
            onClick={() => setSelectedExp(exp)}
            className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
          >
            {exp.thumbnail_url && (
              <img
                src={exp.thumbnail_url}
                alt={exp.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
            )}
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{exp.title}</CardTitle>
                <Badge variant="secondary">{exp.subject}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {exp.description || 'Click to open interactive experiment guide'}
              </p>
              {exp.difficulty && (
                <Badge variant="outline" className="mt-2 capitalize">
                  {exp.difficulty}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
        {experiments.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No experiments available yet
          </p>
        )}
      </div>

      {selectedExp && (
        <ExperimentBottomSheetDrawer
          experiment={selectedExp}
          onClose={() => setSelectedExp(null)}
          subjectFallback={selectedExp.subject}
          relatedPool={experiments}
        />
      )}
    </div>
  );
}
