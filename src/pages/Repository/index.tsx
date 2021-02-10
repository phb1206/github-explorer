import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

import { Header, RepoInfo, Issues } from './styles';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface Issue {
  id: number;
  title: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[] | null>(null);

  useEffect(() => {
    api.get(`repos/${params.repository}`).then(res => {
      setRepository(res.data);
    });

    api.get(`repos/${params.repository}/issues`).then(res => {
      setIssues(res.data);
    });
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="GitHub Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} style={{ strokeWidth: '4' }} />
          Back
        </Link>
      </Header>

      <RepoInfo>
        <header>
          <img
            src={repository?.owner.avatar_url}
            alt={repository?.owner.login}
          />
          <div>
            <strong>{repository?.full_name}</strong>
            <p>{repository?.description}</p>
          </div>
        </header>

        <ul>
          <li>
            <strong>{repository?.stargazers_count}</strong>
            Stars
          </li>
          <li>
            <strong>{repository?.forks_count}</strong>
            Forks
          </li>
          <li>
            <strong>{repository?.open_issues_count}</strong>
            Open Issues
          </li>
        </ul>
      </RepoInfo>

      <Issues>
        {issues?.map(issue => (
          <Link key={issue.id} to="/">
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
