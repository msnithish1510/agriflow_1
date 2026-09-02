import 'package:flutter/material.dart';

class HarvestDeclarationScreen extends StatefulWidget {
  const HarvestDeclarationScreen({super.key});

  @override
  State<HarvestDeclarationScreen> createState() => _HarvestDeclarationScreenState();
}

class _HarvestDeclarationScreenState extends State<HarvestDeclarationScreen> {
  final _formKey = GlobalKey<FormState>();
  String _selectedCrop = 'Tomato';
  double _expectedQtyKg = 10000;
  double _expectedPrice = 24.0;
  DateTime _expectedHarvestDate = DateTime.now().add(const Duration(days: 18));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pre-Harvest Declaration 🌾'),
        backgroundColor: const Color(0xFF10B981),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              color: const Color(0xFF121A2A),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const Icon(Icons.psychology, color: Color(0xFF10B981), size: 40),
                    const SizedBox(height: 8),
                    const Text(
                      'Match Future Buyer Demand',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Declare expected crop yield to receive direct buyer matches before harvest.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey[400], fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Form(
              key: _formKey,
              child: Column(
                children: [
                  DropdownButtonFormField<String>(
                    value: _selectedCrop,
                    decoration: const InputDecoration(labelText: 'Select Crop'),
                    items: ['Tomato', 'Onion', 'Potato', 'Wheat', 'Moong']
                        .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (val) => setState(() => _selectedCrop = val!),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    initialValue: _expectedQtyKg.toString(),
                    decoration: const InputDecoration(labelText: 'Expected Harvest Quantity (kg)'),
                    keyboardType: TextInputType.number,
                    onSaved: (val) => _expectedQtyKg = double.parse(val!),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    initialValue: _expectedPrice.toString(),
                    decoration: const InputDecoration(labelText: 'Minimum Expected Price (₹/kg)'),
                    keyboardType: TextInputType.number,
                    onSaved: (val) => _expectedPrice = double.parse(val!),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      minimumSize: const Size.fromHeight(50),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Harvest Declaration Broadcasted to AGRIFlow Matcher!')),
                      );
                    },
                    child: const Text('Declare Expected Harvest', style: TextStyle(color: Colors.white, fontSize: 16)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
