import Grid from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ChatIcon from '@mui/icons-material/Chat'
import GroupsIcon from '@mui/icons-material/Groups'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function Teams() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={2}>
          <Menu />
        </Grid>
        <Grid size={4}>
          <ChannelList />
        </Grid>
        <Grid size={6}>
          <MessageList />
        </Grid>
      </Grid>
    </div>
  )
}

function Menu() {
  return (
    <Stack textAlign='center' spacing={2}>
      <Stack>
        <div>
          <NotificationsIcon />
        </div>
        <div>アクティビティ</div>
      </Stack>
      <Stack>
        <div>
          <ChatIcon />
        </div>
        <div>チャット</div>
      </Stack>
      <Stack>
        <div>
          <GroupsIcon />
        </div>
        <div>チーム</div>
      </Stack>
    </Stack>
  )
}

function ChannelList() {
  const channels = ['一般', '担任連絡', '就職チャンネル', '出席連絡']

  return (
    <List>
      {channels.map((channel) => (
        <ListItem key={channel}>
          <ListItemButton>
            <ListItemText primary={channel} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

function MessageList() {
  const messages = ['hoge hoge', 'fuga fuga', 'piyo piyp']

  return (
    <Stack spacing={2}>
      {messages.map((message) => (
        <Card key={message}>
          <CardContent>{message}</CardContent>
        </Card>
      ))}
    </Stack>
  )
}
