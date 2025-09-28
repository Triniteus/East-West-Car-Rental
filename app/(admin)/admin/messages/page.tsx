// app/(admin)/admin/messages/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
    Search,
    MessageSquare,
    Eye,
    Reply,
    Trash2,
    Filter,
    Mail,
    User,
    Calendar
} from 'lucide-react'

interface ContactMessage {
    id: number
    name: string
    email: string
    message: string
    status: 'unread' | 'read' | 'replied'
    admin_notes?: string
    created_at: string
    updated_at: string
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [replyText, setReplyText] = useState('')
    const [adminNotes, setAdminNotes] = useState('')

    useEffect(() => {
        fetchMessages()
    }, [statusFilter, searchTerm])

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm })
            })

            const response = await fetch(`/api/admin/messages?${params}`)
            const data = await response.json()

            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateMessageStatus = async (messageId: number, status: string) => {
        try {
            const response = await fetch(`/api/admin/messages/${messageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, admin_notes: adminNotes })
            })

            if (response.ok) {
                fetchMessages()
                setSelectedMessage(null)
                setAdminNotes('')
            }
        } catch (error) {
            console.error('Error updating message:', error)
        }
    }

    const deleteMessage = async (messageId: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            const response = await fetch(`/api/admin/messages/${messageId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                fetchMessages()
                setSelectedMessage(null)
            }
        } catch (error) {
            console.error('Error deleting message:', error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'unread': return 'bg-red-100 text-red-800'
            case 'read': return 'bg-yellow-100 text-yellow-800'
            case 'replied': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const filteredMessages = messages.filter(message => {
        const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                        {messages.filter(m => m.status === 'unread').length} Unread
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search messages..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">All Messages</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredMessages.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No messages found.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredMessages.map((message) => (
                            <Card
                                key={message.id}
                                className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedMessage?.id === message.id ? 'ring-2 ring-emerald-500' : ''
                                    } ${message.status === 'unread' ? 'border-l-4 border-l-red-500' : ''}`}
                                onClick={() => setSelectedMessage(message)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span className="font-semibold text-gray-900">{message.name}</span>
                                                <Badge className={getStatusColor(message.status)}>
                                                    {message.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="h-3 w-3" />
                                                <span>{message.email}</span>
                                                <Calendar className="h-3 w-3 ml-2" />
                                                <span>{new Date(message.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm line-clamp-3">{message.message}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Message Detail Panel */}
                <div className="lg:col-span-1">
                    {selectedMessage ? (
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Message Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">From: {selectedMessage.name}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{selectedMessage.email}</p>
                                    <p className="text-xs text-gray-500">
                                        Received: {new Date(selectedMessage.created_at).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Message:</h4>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Admin Notes:</h4>
                                    <Textarea
                                        value={adminNotes || selectedMessage.admin_notes || ''}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add notes about this message..."
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Button
                                        onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                                        disabled={selectedMessage.status === 'read'}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Mark as Read
                                    </Button>

                                    <Button
                                        onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={selectedMessage.status === 'replied'}
                                    >
                                        <Reply className="h-4 w-4 mr-2" />
                                        Mark as Replied
                                    </Button>

                                    <Button
                                        onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: Your Inquiry&body=Dear ${selectedMessage.name},%0A%0AThank you for contacting East West Car Rentals.%0A%0A`)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Reply via Email
                                    </Button>

                                    <Button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Message
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Select a message to view details</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}