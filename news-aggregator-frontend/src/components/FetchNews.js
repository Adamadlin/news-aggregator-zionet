

// src/components/FetchNews.js
import React, { useMemo, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';

function parseDateSafe(value) {
  const d = value ? new Date(value) : null;
  return d && !isNaN(d.getTime()) ? d : null;
}

function mergeSortByDateDesc(arr) {
  if (!Array.isArray(arr)) return [];
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSortByDateDesc(arr.slice(0, mid));
  const right = mergeSortByDateDesc(arr.slice(mid));

  let i = 0;
  let j = 0;
  const merged = [];

  while (i < left.length && j < right.length) {
    const dl = parseDateSafe(left[i]?.pubDate)?.getTime() ?? 0;
    const dr = parseDateSafe(right[j]?.pubDate)?.getTime() ?? 0;

    // Descending (newest first)
    if (dl >= dr) {
      merged.push(left[i++]);
    } else {
      merged.push(right[j++]);
    }
  }

  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);

  return merged;
}

export default function FetchNews() {
  const [email, setEmail] = useState('');
  const [articles, setArticles] = useState([]);
  const [prefs, setPrefs] = useState([]);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const sorted = useMemo(() => mergeSortByDateDesc(articles), [articles]);

  const handleFetch = async () => {
    if (!email) {
      setStatus({ type: 'error', text: 'Please enter an email.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await axios.post('http://localhost:6003/users/fetch-news', { email });

      // ✅ Now backend always returns { articles: [...], preferences: [...] }
      setArticles(res.data.articles || []);
      setPrefs(res.data.preferences || []);

      if (!res.data.articles || res.data.articles.length === 0) {
        setStatus({ type: 'info', text: 'No news found for this user preferences.' });
      } else {
        setStatus({ type: 'success', text: 'News fetched successfully (sorted with Merge Sort).' });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setStatus({ type: 'error', text: `Error: ${msg}` });
      setArticles([]);
      setPrefs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h5">Fetch News</Typography>
          <Chip label="Merge Sort" variant="outlined" />
        </Box>

        <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
          Enter a registered user email. The backend reads preferences from MongoDB, fetches matching news,
          then we sort by date using Merge Sort.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" onClick={handleFetch} disabled={loading} sx={{ minWidth: 140 }}>
            {loading ? '...' : 'FETCH NEWS'}
          </Button>
        </Box>

        {!!prefs.length && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ mr: 1, opacity: 0.8 }}>
              Preferences:
            </Typography>
            {prefs.map((p) => (
              <Chip key={p} size="small" label={p} />
            ))}
          </Box>
        )}

        {status.text && (
          <Box sx={{ mt: 2 }}>
            <Alert severity={status.type || 'info'}>{status.text}</Alert>
          </Box>
        )}

        {sorted.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <List dense>
              {sorted.map((a, idx) => {
                const d = parseDateSafe(a.pubDate);
                const dateLabel = d ? d.toISOString().replace('T', ' ').slice(0, 19) : 'No date';
                return (
                  <ListItem key={`${a.link}-${idx}`} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Link href={a.link} target="_blank" rel="noreferrer" underline="hover">
                          {a.title}
                        </Link>
                      }
                      secondary={`${dateLabel}${a.source ? ` • ${a.source}` : ''}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
}