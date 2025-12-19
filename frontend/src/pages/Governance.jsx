// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Vote, Plus, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import TokenBalance from "@/components/common/TokenBalance";
import { useLanguage } from '@/components/common/LanguageContext';

export default function Governance() {
  const { t, language } = useLanguage();
  const [user, setUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', category: 'platform_upgrade' });
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals'],
    
    queryFn: () => base44.entities.Proposal.list('-created_date', 50),
  });

  const createProposalMutation = useMutation({
    mutationFn: async () => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      
      await base44.entities.Proposal.create({
        ...newProposal,
        proposer_email: user.email,
        votes_for: 0,
        votes_against: 0,
        total_votes: 0,
        status: 'active',
        voting_end_date: endDate.toISOString(),
        quorum_required: 1000
      });
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries(['proposals']);
      setShowCreateDialog(false);
      setNewProposal({ title: '', description: '', category: 'platform_upgrade' });
    }
  });

  const voteMutation = useMutation({
    
    mutationFn: async ({ proposalId, voteType }) => {
      const proposal = proposals.find(p => p.id === proposalId);
      const votingPower = user?.voting_power || 100;
      
      await base44.entities.Proposal.update(proposalId, {
        votes_for: voteType === 'for' ? (proposal.votes_for || 0) + votingPower : proposal.votes_for,
        votes_against: voteType === 'against' ? (proposal.votes_against || 0) + votingPower : proposal.votes_against,
        total_votes: (proposal.total_votes || 0) + votingPower
      });
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries(['proposals']);
    }
  });

  const categoryColors = {
    asset_acquisition: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    fee_adjustment: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    partnership: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    platform_upgrade: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    esg_initiative: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return Clock;
      case 'passed': return CheckCircle;
      case 'rejected': return XCircle;
      case 'executed': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-amber-400';
      case 'passed': return 'text-emerald-400';
      case 'rejected': return 'text-red-400';
      case 'executed': return 'text-sky-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Vote 

              className="w-8 h-8 text-amber-400" />
              {t('governance.title')}
            </h1>
            <p className="text-slate-400">{t('governance.subtitle')}</p>
          </div>
          
          {user && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <

                Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                  <Plus 

                  className="w-4 h-4 mr-2" />
                  {t('governance.createProposal')}
                </Button>
              </DialogTrigger>
              <

              DialogContent className="bg-slate-900 border-slate-800">
                <

                DialogHeader>
                  <

                  DialogTitle className="text-white">{t('governance.createProposal')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <

                    Label className="text-slate-400">{t('governance.proposalTitle')}</Label>
                    <Input
                      
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                    />
                  </div>
                  <div>
                    <

                    Label className="text-slate-400">{t('governance.proposalCategory')}</Label>
                    <Select 
                      value={newProposal.category} 
                      onValueChange={(v) => setNewProposal({ ...newProposal, category: v })}
                    >
                      <

                      SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <

                      SelectContent className="bg-slate-800 border-slate-700">
                        {Object.keys(categoryColors).map((key) => (
                          <

                          SelectItem key={key} value={key}>{t(`governance.categories.${key}`)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <

                    Label className="text-slate-400">{t('governance.proposalDescription')}</Label>
                    <Textarea
                      
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white mt-2 min-h-32"
                      placeholder={t('governance.descriptionPlaceholder')}
                    />
                  </div>
                  <

                  Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
                    onClick={() => createProposalMutation.mutate()}
                    disabled={createProposalMutation.isPending || !newProposal.title}
                  >
                    {createProposalMutation.isPending ? t('governance.submitting') : t('governance.submitProposal')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Token Balance */}
        {user && (
          <div className="mb-6">
            <TokenBalance 
              draBalance={user?.dra_balance || 1500}
              votingPower={user?.voting_power || 1500}
              pendingRewards={0}
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <

          Card className="bg-slate-900/50 border-slate-800 p-5">
            <p className="text-slate-400 text-sm">{t('governance.activeProposals')}</p>
            <p className="text-2xl font-bold text-white mt-1">{proposals.filter(p => p.status === 'active').length}</p>
          </Card>
          <

          Card className="bg-slate-900/50 border-slate-800 p-5">
            <p className="text-slate-400 text-sm">{t('governance.passed')}</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{proposals.filter(p => p.status === 'passed').length}</p>
          </Card>
          <

          Card className="bg-slate-900/50 border-slate-800 p-5">
            <p className="text-slate-400 text-sm">{t('governance.totalVotingPower')}</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">2.5M DRA</p>
          </Card>
          <

          Card className="bg-slate-900/50 border-slate-800 p-5">
            <p className="text-slate-400 text-sm">{t('governance.participants')}</p>
            <p className="text-2xl font-bold text-violet-400 mt-1">1,234</p>
          </Card>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <

              Card key={i} className="bg-slate-900/50 border-slate-800 p-6 animate-pulse">
                <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
              </Card>
            ))
          ) : proposals.length > 0 ? (
            proposals.map((proposal) => {
              const StatusIcon = getStatusIcon(proposal.status);
              const statusColor = getStatusColor(proposal.status);
              const totalVotes = proposal.total_votes || 0;
              const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 50;
              
              return (
                <

                Card key={proposal.id} className="bg-slate-900/50 border-slate-800 p-6 hover:border-slate-700 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <

                        Badge className={`${categoryColors[proposal.category]} border`}>
                          {t(`governance.categories.${proposal.category}`)}
                        </Badge>
                        <Badge variant="outline" className={`border-slate-700 ${statusColor}`}>
                          <StatusIcon 

                          className="w-3 h-3 mr-1" />
                          {t(`governance.status.${proposal.status}`)}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{proposal.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2">{proposal.description}</p>
                    </div>
                    
                    {proposal.status === 'active' && user && (
                      <div className="flex gap-2">
                        <

                        Button 
                          variant="outline" 
                          size="sm"
                          className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                          
                          onClick={() => voteMutation.mutate({ proposalId: proposal.id, voteType: 'for' })}
                          disabled={voteMutation.isPending}
                        >
                          <ThumbsUp 

                          className="w-4 h-4 mr-1" />
                          {t('governance.voteFor')}
                        </Button>
                        <

                        Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          
                          onClick={() => voteMutation.mutate({ proposalId: proposal.id, voteType: 'against' })}
                          disabled={voteMutation.isPending}
                        >
                          <ThumbsDown 

                          className="w-4 h-4 mr-1" />
                          {t('governance.voteAgainst')}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Voting Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400">{t('governance.voteFor')} {(proposal.votes_for || 0).toLocaleString()}</span>
                      <span className="text-red-400">{t('governance.voteAgainst')} {(proposal.votes_against || 0).toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${forPercentage}%` }} />
                      <div className="bg-red-500 h-full transition-all" style={{ width: `${100 - forPercentage}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users 

                        className="w-3 h-3" />
                        {t('governance.totalVotes')}: {totalVotes.toLocaleString()} / {(proposal.quorum_required || 1000).toLocaleString()} ({t('governance.quorum')})
                      </span>
                      {proposal.voting_end_date && (
                        <span>
                          {new Date(proposal.voting_end_date) > new Date() 
                            
                            ? `${t('governance.remaining')} ${formatDistanceToNow(new Date(proposal.voting_end_date), { locale: language === 'zh' ? zhCN : enUS })}`
                            : t('governance.votingEnded')
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <

            Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
              <Vote 

              className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">{t('governance.noProposals')}</h3>
              <p className="text-slate-400">{t('governance.beFirst')}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}